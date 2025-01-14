# A text input box can be represented as a string, like this:
#
# 'abc|def'
#
# The '|' character is the cursor, and the other characters are the text
# inside the box. Depending on the key that the user presses, you want
# to update the text box.
#
# Pressing 'left' moves the cursor to the left by one character, unless
# there is no character to the left of the cursor:
#
# 'abc|def', 'left' -> 'ab|cdef'
#
# Pressing 'right' moves the cursor to the right by one character,
# unless there is no character to the right of the cursor:
#
# 'abc|', 'right' -> 'abc|'
#
# Lastly, the user can type a single letter like 'z'. This inserts the
# character to the left of the cursor:
#
# 'abc|def', 'z' -> 'abcz|def'
# 
# Write unit tests for the textbox function and fix the three bugs.

def textbox(current, key):
    left, right = current.split('|')
    if key == 'left':
        # Move last char from left to right
        return left[:-1] + '|' + left[-1] + right
    else:
        # Insert char before cursor
        return left + key + right