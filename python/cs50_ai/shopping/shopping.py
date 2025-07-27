import csv
import sys

from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier

TEST_SIZE = 0.4


def main():

    # Check command-line arguments
    if len(sys.argv) != 2:
        sys.exit("Usage: python shopping.py data")

    # Load data from spreadsheet and split into train and test sets
    evidence, labels = load_data(sys.argv[1])
    X_train, X_test, y_train, y_test = train_test_split(
        evidence, labels, test_size=TEST_SIZE
    )

    # Train model and make predictions
    model = train_model(X_train, y_train)
    predictions = model.predict(X_test)
    sensitivity, specificity = evaluate(y_test, predictions)

    # Print results
    print(f"Correct: {(y_test == predictions).sum()}")
    print(f"Incorrect: {(y_test != predictions).sum()}")
    print(f"True Positive Rate: {100 * sensitivity:.2f}%")
    print(f"True Negative Rate: {100 * specificity:.2f}%")

def is_float(s):
        try:
            float(s)
            return True
        except ValueError:
            return False

def load_data(filename):
    """
    Load shopping data from a CSV file `filename` and convert into a list of
    evidence lists and a list of labels. Return a tuple (evidence, labels).

    evidence should be a list of lists, where each list contains the
    following values, in order:
        - Administrative, an integer
        - Administrative_Duration, a floating point number
        - Informational, an integer
        - Informational_Duration, a floating point number
        - ProductRelated, an integer
        - ProductRelated_Duration, a floating point number
        - BounceRates, a floating point number
        - ExitRates, a floating point number
        - PageValues, a floating point number
        - SpecialDay, a floating point number
        - Month, an index from 0 (January) to 11 (December)
        - OperatingSystems, an integer
        - Browser, an integer
        - Region, an integer
        - TrafficType, an integer
        - VisitorType, an integer 0 (not returning) or 1 (returning)
        - Weekend, an integer 0 (if false) or 1 (if true)

    labels should be the corresponding list of labels, where each label
    is 1 if Revenue is true, and 0 otherwise.
    """
    evidence = []
    labels = []
    with open(filename, newline='') as csvfile:
        reader = csv.reader(csvfile)
        next(reader)
        for row in reader:
            evidence_row = []
            label = 1 if row[-1] == "TRUE" else 0
            labels.append(label)
            for val in row[:-1]:
                if val.isnumeric():
                    evidence_row.append(int(val))
                    continue
                if is_float(val):
                    evidence_row.append(float(val))
                    continue
                match val:
                    case "Jan":
                        evidence_row.append(0)
                    case "Feb":
                        evidence_row.append(1)
                    case "Mar":
                        evidence_row.append(2)
                    case "Apr":
                        evidence_row.append(3)
                    case "May":
                        evidence_row.append(4)
                    case "June":
                        evidence_row.append(5)
                    case "Jul":
                        evidence_row.append(6)
                    case "Aug":
                        evidence_row.append(7)
                    case "Sep":
                        evidence_row.append(8)
                    case "Oct":
                        evidence_row.append(9)
                    case "Nov":
                        evidence_row.append(10)
                    case "Dec":
                        evidence_row.append(11)
                    case "Returning_Visitor":
                        evidence_row.append(1)
                    case "New_Visitor":
                        evidence_row.append(0)
                    case "Other":
                        evidence_row.append(0)
                    case "TRUE":
                        evidence_row.append(1)
                    case "FALSE":
                        evidence_row.append(0)
            
            if len(evidence_row) != len(row) - 1:
                print(evidence_row, row)
                raise ValueError
            evidence.append(evidence_row)
        return (evidence, labels)

def train_model(evidence, labels):
    """
    Given a list of evidence lists and a list of labels, return a
    fitted k-nearest neighbor model (k=1) trained on the data.
    """
    model = KNeighborsClassifier(n_neighbors=1)
    model.fit(evidence, labels)
    return model

def evaluate(labels, predictions):
    """
    Given a list of actual labels and a list of predicted labels,
    return a tuple (sensitivity, specificity).

    Assume each label is either a 1 (positive) or 0 (negative).

    `sensitivity` should be a floating-point value from 0 to 1
    representing the "true positive rate": the proportion of
    actual positive labels that were accurately identified.

    `specificity` should be a floating-point value from 0 to 1
    representing the "true negative rate": the proportion of
    actual negative labels that were accurately identified.
    """
    total_positive_labels = 0
    total_negative_labels = 0
    corret_positive_labels = 0
    correct_negative_labels = 0

    for i in range(len(labels)):
        if labels[i] == 1:
            total_positive_labels += 1
            if predictions[i] == 1:
                corret_positive_labels += 1

        if labels[i] == 0:
            total_negative_labels += 1
            if predictions[i] == 0:
                correct_negative_labels += 1
        

    sensitivity = corret_positive_labels / total_positive_labels
    specificity = correct_negative_labels / total_negative_labels
    return (sensitivity, specificity)

if __name__ == "__main__":
    main()
