import os
import random
import re
import sys

DAMPING = 0.85
SAMPLES = 10000


def main():
    if len(sys.argv) != 2:
        sys.exit("Usage: python pagerank.py corpus")
    corpus = crawl(sys.argv[1])
    ranks = sample_pagerank(corpus, DAMPING, SAMPLES)
    print(f"PageRank Results from Sampling (n = {SAMPLES})")
    for page in sorted(ranks):
        print(f"  {page}: {ranks[page]:.4f}")
    ranks = iterate_pagerank(corpus, DAMPING)
    print(f"PageRank Results from Iteration")
    for page in sorted(ranks):
        print(f"  {page}: {ranks[page]:.4f}")


def crawl(directory):
    """
    Parse a directory of HTML pages and check for links to other pages.
    Return a dictionary where each key is a page, and values are
    a list of all other pages in the corpus that are linked to by the page.
    """
    pages = dict()

    # Extract all links from HTML files
    for filename in os.listdir(directory):
        if not filename.endswith(".html"):
            continue
        with open(os.path.join(directory, filename)) as f:
            contents = f.read()
            links = re.findall(r"<a\s+(?:[^>]*?)href=\"([^\"]*)\"", contents)
            pages[filename] = set(links) - {filename}

    # Only include links to other pages in the corpus
    for filename in pages:
        pages[filename] = set(
            link for link in pages[filename]
            if link in pages
        )

    return pages


def transition_model(corpus, page, damping_factor):
    dic = {}
    num_pages = len(corpus)
    num_linked_pages = len(corpus[page])

    if num_linked_pages == 0:
        # page does not have links
        for page in corpus:
            dic[page] = 1 / num_pages
        return dic

    for p in corpus:
        dic[p] = (1 - damping_factor) / num_pages

    for p in corpus[page]:
        dic[p] += damping_factor / num_linked_pages

    return dic
    """
    Return a probability distribution over which page to visit next,
    given a current page.

    With probability `damping_factor`, choose a link at random
    linked to by `page`. With probability `1 - damping_factor`, choose
    a link at random chosen from all pages in the corpus.
    """


def sample_pagerank(corpus, damping_factor, n):
    dic = {}
    # num_pages = len(corpus)

    for page in corpus:
        dic[page] = 0

    page = random.choice(list(corpus.keys()))
    t_m = transition_model(corpus, page, damping_factor)
    dic[page] += 1
    
    for _ in range(n - 1):
        # print(list(t_m.keys()), list(t_m.values()))
        page = random.choices(list(t_m.keys()), list(t_m.values()))[0]
        t_m = transition_model(corpus, page, damping_factor)
        dic[page] += 1 

    for page in dic:
        dic[page] = dic[page] / n

    return dic
    """
    Return PageRank values for each page by sampling `n` pages
    according to transition model, starting with a page at random.

    Return a dictionary where keys are page names, and values are
    their estimated PageRank value (a value between 0 and 1). All
    PageRank values should sum to 1.
    """


def iterate_pagerank(corpus, damping_factor):
    N = len(corpus)
    old_pr = {page: 1 / N for page in corpus}
    threshold = 0.001
    max_change = threshold

    while max_change >= threshold:
        new_pr = {}
        max_change = 0

        for page in corpus:
            new_pr[page] = (1 - damping_factor) / N
            for linking_page in corpus:
                if page in corpus[linking_page]:
                    num_links = len(corpus[linking_page])
                    new_pr[page] += damping_factor * old_pr[linking_page] / num_links
                if len(corpus[linking_page]) == 0:
                    new_pr[page] += damping_factor * old_pr[linking_page] / N

            current_change = abs(new_pr[page] - old_pr[page])
            if current_change > max_change:
                max_change = current_change

        old_pr = new_pr

    return old_pr


if __name__ == "__main__":
    main()


# 1 -> 2, 3, 4
# 2 -> 3, 4
# 3 -> 1, 2

# calc 1 calls 2, 3, 4



# :( sample_pagerank returns correct results for simple corpus
#     expected pagerank 2 to be in range [0.37921, 0.47920999999999997], got 0.3052 instead
# :( sample_pagerank returns correct results for complex corpus
#     expected pagerank 1 to be in range [0.07537999999999999, 0.17537999999999998], got 0.1908 instead
# :( sample_pagerank returns correct results for corpus with disjoint sets of pages
#     expected pagerank 2 to be in range [0.16460999999999998, 0.26461], got 0.1129 instead
# :( sample_pagerank returns correct results for corpus with pages without links
#     expected pagerank 2 to be in range [0.3032, 0.4032], got 0.2078 instead
