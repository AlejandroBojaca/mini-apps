def count_words(text):
    separated_text = text.split()
    return len(separated_text)

def count_letters(text):
    lowered_text = text.lower()
    dic = {}
    for letter in lowered_text:
        if letter.isalpha():
            dic[letter] = dic.get(letter, 0) + 1
    return dic

def list_of_letters(dic):
    list = []
    for key in dic:
        list.append({ "char": key, "count": dic[key] })
    return list

def sort_on(dict):
    return dict["count"]

def print_report(list, count):
    print(f"{count} words found in the document\n")
    for element in list:
        print(f"The {element['char']} character was found {element['count']} times")
    print("--- End report ---")

def main():
    with open('./books/frankenstein.txt') as f:
        file_contents = f.read()
        letters_dictionary = count_letters(file_contents)
        list_of_characters = list_of_letters(letters_dictionary)
        list_of_characters.sort(reverse=True, key=sort_on)
        print_report(list_of_characters, len(list_of_characters))
main()