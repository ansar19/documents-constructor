# Test template

## [#] - Variables

Display a variable: [STRING VARIABLE The string variable]

Display two vars on same line: [VARIABLE] [VARIABLE]

Variable definition with no description: [MYSTERY_VAR]

## [#] - Blocks
[[BLOCK SHOW_THIS] Show the first block ?]

### [##] - Block SHOW_THIS

This content will be used if the first block is selected
[[BLOCK SUB_BLOCK] A sub block]

#### [###] - Block SUB_BLOCK

Content of the sub block

This is the sub block content with an inline var: [INLINE_VAR Inline var] <- This is the var :)
[[END SUB_BLOCK]]
[[END SHOW_THIS]]

[[BLOCK REPEATED] This block will be repeated at the end of the document]
Content of the repeated block
[[END REPEATED]]

[[BLOCK A_BLOCK] Block description]This is a block on one line[[END A_BLOCK]]

[[BLOCK LAST] Last block with weird $:[\/_- chars]The last block[[END LAST]]

### [##] - This should be 2.2 when all blocks are shown

#### [###] - This should be 2.2.1

An incorrect block: 
[[BLOCK FAILING_BLOCK] A failing block]

## [#] - Conditional display

[[IF SHOW_THIS]]This will be displayed only if SHOW_THIS block is **active**.[[ENDIF SHOW_THIS]]

[[UNLESS SHOW_THIS]]This will be displayed if SHOW_THIS block is **inactive**.[[ENDUNLESS SHOW_THIS]]

[[IF SHOW_THIS]]This is a check repetition.[[ENDIF SHOW_THIS]]

### [##] - Nested conditionals

[[IF SHOW_THIS]]
This will be displayed only if `SHOW_THIS` block is **active**.
[[UNLESS LAST]]

This will be displayed if `SHOW_THIS` block is **active** but `LAST` is **not**.
[[ENDUNLESS LAST]]
[[ENDIF SHOW_THIS]]

## [#] - Duplicate a block:

[[REPEATED]]
