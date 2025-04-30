"""
Tic Tac Toe Player
"""

import math
import copy

X = "X"
O = "O"
EMPTY = None


def initial_state():
    """
    Returns starting state of the board.
    """
    return [[EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY]]


def player(board):
    x_count = 0
    o_count = 0
    for row in board:
        for cell in row:
            if cell == O:
                o_count += 1
            elif cell == X:
                x_count += 1
    
    return O if o_count < x_count else X
    """
    Returns player who has the next turn on a board.
    """

def actions(board):
    possible_actions = set()
    for i in range(3):
        for j in range(3):
            if board[i][j] == EMPTY:
                possible_actions.add((i, j))

    return possible_actions
    """
    Returns set of all possible actions (i, j) available on the board.
    """


def result(board, action):
    row = action[0]
    cell = action[1]
    if board[row][cell] is not EMPTY or row < 0 or cell < 0 or row > 2 or cell > 2:
        raise Exception("Invalid move")
    new_board = copy.deepcopy(board)

    new_board[row][cell] = player(board)
    return new_board
    """
    Returns the board that results from making move (i, j) on the board.
    """


def winner(board):
    for i in range(3):
        if board[i][0] == board[i][1] and board[i][1] == board[i][2] and board[i][0] is not EMPTY:
            return board[i][0]
        
        if board[0][i] == board[1][i] and board[1][i] == board[2][i] and board[0][i] is not EMPTY:
            return board[0][i]
        
    if board[0][0] == board[1][1] and board[1][1] == board[2][2] and board[0][0] is not EMPTY:
        return board[0][0]
    
    if board[2][0] == board[1][1] and board[1][1] == board[0][2] and board[2][0] is not EMPTY:
        return board[2][0]

    return None
    """
    Returns the winner of the game, if there is one.
    """


def terminal(board):
    if winner(board) is not None:
        return True
    
    for row in board:
        for cell in row:
            if cell is EMPTY:
                return False
            
    return True
    """
    Returns True if game is over, False otherwise.
    """


def utility(board):
    if winner(board) == X:
        return 1
    if winner(board) == O:
        return -1

    return 0
    """
    Returns 1 if X has won the game, -1 if O has won, 0 otherwise.
    """


def minimax(board):
    if terminal(board):
        return None

    turn = player(board)
    best_action = None

    if turn == X:
        best = float('-inf')
        for action in actions(board):
            v = min_value(result(board, action))
            if v > best:
                best_action = action
                best = v
    
    else:
        best = float('inf')
        for action in actions(board):
            v = max_value(result(board, action))
            if v < best:
                best_action = action
                best = v
    
    return best_action
    """
    Returns the optimal action for the current player on the board.
    """


def max_value(board):
    if terminal(board):
        return utility(board)

    v = float('-inf')
    for action in  actions(board):
        v = max(v, min_value(result(board, action)))
    return v


def min_value(board):
    if terminal(board):
        return utility(board)

    v = float('inf')
    for action in  actions(board):
        v = min(v, max_value(result(board, action)))
    return v