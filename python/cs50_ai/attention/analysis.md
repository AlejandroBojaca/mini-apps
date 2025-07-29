# Analysis

## Layer 6, Head 8

This attention head appears to specialize in identifying relationships between verbs and their direct objects. The head consistently shows strong attention from verbs to their objects across different sentence structures.

Example Sentences:

- "She ate the [MASK] quickly" (verb "ate" attends strongly to "[MASK]" position)

- "The boy kicked the [MASK] down the street" (verb "kicked" focuses on "[MASK]" position)

## Layer 2, Head 5

This head demonstrates a clear pattern of attending to the previous word in the sequence, creating a backward-looking relationship. It seems particularly strong at connecting words to their immediate preceding context.

Example Sentences:

- "The quick brown fox jumps over [MASK]" (each word attends most strongly to the word before it)

- "After dinner we went for a [MASK]" (each token's brightest attention is to its left neighbor)

