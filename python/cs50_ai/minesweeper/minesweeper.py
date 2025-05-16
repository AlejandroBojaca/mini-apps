import itertools
import random


class Minesweeper():
    """
    Minesweeper game representation
    """

    def __init__(self, height=8, width=8, mines=8):

        # Set initial width, height, and number of mines
        self.height = height
        self.width = width
        self.mines = set()

        # Initialize an empty field with no mines
        self.board = []
        for i in range(self.height):
            row = []
            for j in range(self.width):
                row.append(False)
            self.board.append(row)

        # Add mines randomly
        # self.mines.add((1, 1))
        # self.board[1][1] = True
        # self.mines.add((2, 2))
        # self.board[2][2] = True
        while len(self.mines) != mines:
            i = random.randrange(height)
            j = random.randrange(width)
            if not self.board[i][j]:
                self.mines.add((i, j))
                self.board[i][j] = True

        # At first, player has found no mines
        self.mines_found = set()

    def print(self):
        """
        Prints a text-based representation
        of where mines are located.
        """
        for i in range(self.height):
            print("--" * self.width + "-")
            for j in range(self.width):
                if self.board[i][j]:
                    print("|X", end="")
                else:
                    print("| ", end="")
            print("|")
        print("--" * self.width + "-")

    def is_mine(self, cell):
        i, j = cell
        return self.board[i][j]

    def nearby_mines(self, cell):
        """
        Returns the number of mines that are
        within one row and column of a given cell,
        not including the cell itself.
        """

        # Keep count of nearby mines
        count = 0

        # Loop over all cells within one row and column
        for i in range(cell[0] - 1, cell[0] + 2):
            for j in range(cell[1] - 1, cell[1] + 2):

                # Ignore the cell itself
                if (i, j) == cell:
                    continue

                # Update count if cell in bounds and is mine
                if 0 <= i < self.height and 0 <= j < self.width:
                    if self.board[i][j]:
                        count += 1

        return count

    def won(self):
        """
        Checks if all mines have been flagged.
        """
        return self.mines_found == self.mines


class Sentence():
    """
    Logical statement about a Minesweeper game
    A sentence consists of a set of board cells,
    and a count of the number of those cells which are mines.
    """

    def __init__(self, cells, count):
        self.cells = set(cells)
        self.count = count
        
        self.mines = set()
        self.safes = set()

    def __eq__(self, other):
        return self.cells == other.cells and self.count == other.count

    def __str__(self):
        return f"{self.cells} = {self.count}"

    def known_mines(self):
        if len(self.cells) == self.count and self.count > 0:
            return set(self.cells)
        return set()

    def known_safes(self):
        if self.count == 0:
            return set(self.cells)
        return set()

    def mark_mine(self, cell):
        if cell in self.cells:
            self.cells.remove(cell)
            self.mines.add(cell)
            self.count -= 1
        """
        Updates internal knowledge representation given the fact that
        a cell is known to be a mine.
        """
        # raise NotImplementedError

    def mark_safe(self, cell):
        if cell in self.cells:
            self.cells.remove(cell)
            self.safes.add(cell)
        """
        Updates internal knowledge representation given the fact that
        a cell is known to be safe.
        """
        # raise NotImplementedError


class MinesweeperAI():
    """
    Minesweeper game player
    """

    def __init__(self, height=8, width=8):

        # Set initial height and width
        self.height = height
        self.width = width

        # Keep track of which cells have been clicked on
        self.moves_made = set()

        # Keep track of cells known to be safe or mines
        self.mines = set()
        self.safes = set()

        # List of sentences about the game known to be true
        self.knowledge = []

    def mark_mine(self, cell):
        """
        Marks a cell as a mine, and updates all knowledge
        to mark that cell as a mine as well.
        """
        self.mines.add(cell)
        for sentence in self.knowledge:
            sentence.mark_mine(cell)

    def mark_safe(self, cell):
        """
        Marks a cell as safe, and updates all knowledge
        to mark that cell as safe as well.
        """
        self.safes.add(cell)
        for sentence in self.knowledge:
            sentence.mark_safe(cell)

    def get_neighbours(self, cell, count):
        neighbours = []

        for i in range(cell[0] - 1, cell[0] + 2):
            for j in range(cell[1] - 1, cell[1] + 2):

                if i < 0 or i >= self.height or j < 0 or j >= self.width:
                    continue 

                neighbours.append((i, j))

        return (neighbours, count)

    def add_knowledge(self, cell, count):
    # Step 1: Mark the cell as a move made and safe
        self.moves_made.add(cell)
        self.mark_safe(cell)

        # Step 2: Create a new sentence based on the cell's neighbors
        neighbors = set()
        for i in range(cell[0] - 1, cell[0] + 2):
            for j in range(cell[1] - 1, cell[1] + 2):
                if (i, j) == cell or not (0 <= i < self.height and 0 <= j < self.width):
                    continue
                if (i, j) in self.safes:
                    continue
                if (i, j) in self.mines:
                    count -= 1
                    continue
                neighbors.add((i, j))

        if neighbors:
            self.knowledge.append(Sentence(neighbors, count))

        # Step 3: Keep inferring new safes and mines until no new info
        changed = True
        while changed:
            changed = False

            safes = set()
            mines = set()

            for sentence in self.knowledge:
                safes |= sentence.known_safes()
                mines |= sentence.known_mines()

            for safe in safes:
                if safe not in self.safes:
                    self.mark_safe(safe)
                    changed = True

            for mine in mines:
                if mine not in self.mines:
                    self.mark_mine(mine)
                    changed = True

            # Step 4: Try to infer new sentences from existing ones
            new_sentences = []
            for s1 in self.knowledge:
                for s2 in self.knowledge:
                    if s1 == s2 or not s1.cells or not s2.cells:
                        continue
                    if s1.cells.issubset(s2.cells):
                        diff = s2.cells - s1.cells
                        diff_count = s2.count - s1.count
                        new_sentence = Sentence(diff, diff_count)
                        if new_sentence not in self.knowledge and new_sentence not in new_sentences:
                            new_sentences.append(new_sentence)

            if new_sentences:
                self.knowledge.extend(new_sentences)
                changed = True

        # Optional: Clean up empty sentences
        self.knowledge = [s for s in self.knowledge if s.cells]


    def make_safe_move(self):
        for safe_move in self.safes:
            if safe_move not in self.moves_made:
                self.safes.remove(safe_move)
                return safe_move
            
        return None
        """
        Returns a safe cell to choose on the Minesweeper board.
        The move must be known to be safe, and not already a move
        that has been made.

        This function may use the knowledge in self.mines, self.safes
        and self.moves_made, but should not modify any of those values.
        """
        raise NotImplementedError

    
    def make_random_move(self):
        possible_moves = [
            (i, j)
            for i in range(self.height)
            for j in range(self.width)
            if (i, j) not in self.moves_made and (i, j) not in self.mines
        ]

        if not possible_moves:
            return None
        
        move = random.choice(possible_moves)
        print("Random Move: ", move)
        self.moves_made.add(move)
        return move