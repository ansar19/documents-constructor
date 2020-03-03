import Vue from 'vue'

const regexes = {
  simpleBlock: /\[\[([A-Z_]*)\]\]/,
  simpleVariable: /\[~((?:[0-9]+_)?[A-Z_]+)\]/,
  blockReplacement: blockName => new RegExp(`\\[\\[${blockName}\\]\\]`),
  variableReplacement: variableName => new RegExp(`\\[~${variableName}\\]`),
}

const date = new Date()
const shortCodes = {
  DATE_YEAR: date.getFullYear(),
  DATE_MONTH: date.getMonth() + 1,
  DATE_DAY: date.getDate(),
}

const emptyVariableContent = '________'

const parser = {
  parse (sourceToParse) {
    const extractedVariables = this.extractVariables(sourceToParse)
    const extractedBlocks = this.extractBlocks(extractedVariables.source)

    return { source: extractedBlocks.source, blocks: extractedBlocks.blocks, variables: extractedVariables.variables }
  },
  extractBlocks (source, parentBlock = null) {
    const blockRegexp = /\[\[BLOCK ([A-Z_]+)\] ([^\]]*)\]/
    const blocks = []
    let matches

    // Find inclusions and redefinitions
    if (parentBlock) {
      let regex = new RegExp(`\\[\\[(BLOCK )?${parentBlock}\\](.*?)\\]`)
      do {
        matches = regex.exec(source)
        if (matches) {
          source = source.replace(regex, `**[[ERROR: ${parentBlock} cannot be nested in itself]]**`)
        }
      } while (matches)
    }

    // Find block starts
    do {
      matches = blockRegexp.exec(source)

      if (matches) {
        let name = matches[1]
        let description = matches[2]

        // Used to replace block opening if no block end is found
        let blockStartRegexp = `\\[\\[BLOCK ${name}\\] ${utils.escapeStringForRegex(description)}\\]`
        // The whole block
        let blockRegexp = `${blockStartRegexp}([\\s\\S]*)\\[\\[END ${name}\\]\\]`

        // Find block end
        let endMatches = new RegExp(blockRegexp, 'm').exec(source)
        if (endMatches) {
          // Find sub-blocks
          let subBlocks = this.extractBlocks(endMatches[1], name)
          let block = {
            name: matches[1],
            description: matches[2],
            content: subBlocks.source,
            blocks: subBlocks.blocks,
            show: true,
          }

          // Add the block
          blocks.push(block)

          // Remove content from source
          let wholeBlockRegex = new RegExp(`(${blockRegexp})`, 'm')
          source = source.replace(wholeBlockRegex, `[[${block.name}]]`)
        } else {
          console.warn(`No end match for ${name}`)
          source = source.replace(new RegExp(blockStartRegexp), `**[[ERROR: ${name} has no end]]**`)
        }
      }
    } while (matches)

    return { source, blocks }
  },
  extractVariables (source) {
    const varRegexpStart = '(^|[^[])\\[(?:(STRING|TEXT|NUMBER) )?'
    const varRegexpEnd = ' ?(.*?)\\]([^\\]]|$)'
    const varRegexp = new RegExp(`${varRegexpStart}((?:[0-9]+_)?[A-Z_]+)${varRegexpEnd}`)
    const variables = []
    let matches

    // Find variables starts
    do {
      matches = varRegexp.exec(source)

      if (matches) {
        let variable = {
          type: matches[2] ? matches[2] : 'STRING',
          name: matches[3],
          description: matches[4],
          content: emptyVariableContent,
        }
        // Add the variable
        let existing = utils.variableExists(variables, variable.name)
        if (!existing || (existing && ['', null].indexOf(existing.description) > -1)) {
          if (existing) {
            let index = variables.findIndex(v => v.name === variable.name)
            variables[index] = variable
          } else {
            variables.push(variable)
          }
        }
        let wholeVarRegexp = new RegExp(`${varRegexpStart}${variable.name}${varRegexpEnd}`)
        // Remove content from source (note replacement of the preceding/next chars, that were selected by the regexp)
        source = source.replace(wholeVarRegexp, `$1[~${variable.name}]$4`)
      }
    } while (matches)

    // Order vars if required:
    if (variables.findIndex(v => /[\d]+_/.exec(v.name) !== null) > -1) {
      variables.sort((a, b) => a.name.localeCompare(b.name))
    }

    return { source, variables }
  },
}

const renderer = {
  parsedSource: '',
  blocks: [],
  variables: [],
  render (parsedSource, blocks, variables) {
    this.parsedSource = parsedSource
    this.blocks = blocks
    this.variables = variables

    return this.renderBlocks()
      .renderConditionals()
      .renderVariables()
      .renderNumbers()
      .renderShortCodes()
      .removeDoubleLines()
      .parsedSource
  },
  renderBlocks () {
    this.parsedSource = this.renderBlock(this.parsedSource)

    return this
  },
  renderConditionals () {
    const blockRegexp = /\[\[(?:(IF|UNLESS) )([A-Z_]*)\]\]/
    let matches

    // Find block starts
    do {
      matches = blockRegexp.exec(this.parsedSource)

      if (matches) {
        // Find block end
        let innerBlockRegexp = `\\[\\[\\${matches[1]} ${matches[2]}\\]\\]([\\s\\S]*?)\\[\\[END${matches[1]} ${matches[2]}\\]\\]`
        let endMatches = new RegExp(innerBlockRegexp).exec(this.parsedSource)
        if (endMatches) {
          let block = utils.blockExists(this.blocks, matches[2])
          if (block) {
            // Remove content from source
            let show = (matches[1] === 'IF' && block.show) || (matches[1] === 'UNLESS' && !block.show)
            let wholeBlockRegex = new RegExp(`(${innerBlockRegexp})`)
            if (show) {
              this.parsedSource = this.parsedSource.replace(wholeBlockRegex, endMatches[1])
            } else {
              this.parsedSource = this.parsedSource.replace(wholeBlockRegex, '')
            }
          }
        } else {
          console.warn(`No end match for ${matches[1]} ${matches[2]}`)
          this.parsedSource = this.parsedSource.replace(new RegExp(innerBlockRegexp), `**[[ERROR: ${matches[1]} ${matches[2]} has no end]]**`)
        }
      }
    } while (matches)

    return this
  },
  renderVariables () {
    let matches

    // Find vars
    do {
      matches = this.parsedSource.match(regexes.simpleVariable)
      if (matches) {
        let variable = utils.variableExists(this.variables, matches[1])
        let replacement = `**[ERROR: Unknown variable ${matches[1]}]**`
        if (variable) {
          replacement = variable.content
        }
        this.parsedSource = this.parsedSource.replace(regexes.variableReplacement(matches[1]), replacement)
      }
    } while (matches)

    return this
  },
  renderNumbers () {
    let section = '0'
    this.parsedSource = this.parsedSource.replace(/\[(#+)\]/g, function (stringToReplace) {
      // Extract numbers in section
      const numbers = section.split('.')
      // Get the desired depth
      const depth = stringToReplace.match(/\[(#+)\]/)[1].length
      // Create an array of 0s of the length of the section to increment
      let out = [...'0'.repeat(depth)]
      // Insert current section
      for (let i = 0; i < numbers.length; i++) { out[i] = numbers[i] }
      // Convert to integers
      out = out.map(e => parseInt(e, 10))
      // Increment the counter
      out[depth - 1]++
      // Truncate the section length
      out.length = depth
      // Update section in caller
      section = out.join('.')
      // Return replacement
      return section
    })

    return this
  },
  removeDoubleLines () {
    do {
      this.parsedSource = this.parsedSource.replace(/^\n\n/gm, '\n')
    } while (/^\n\n/gm.exec(this.parsedSource))

    return this
  },
  renderShortCodes () {
    const regex = /\[~~([A-Z_]+)\]/
    const keys = Object.keys(shortCodes)
    let matches

    do {
      matches = regex.exec(this.parsedSource)

      if (matches) {
        if (keys.indexOf(matches[1]) > -1) {
          this.parsedSource = this.parsedSource.replace(regex, shortCodes[matches[1]])
        } else {
          this.parsedSource = this.parsedSource.replace(regex, `**[ERROR: ~~${matches[1]} is not a valid shortcode]**`)
        }
      }
    } while (matches)

    return this
  },
  renderBlock (text) {
    let matches

    // Find block starts
    do {
      matches = regexes.simpleBlock.exec(text)
      if (matches) {
        let block = utils.blockExists(this.blocks, matches[1])

        if (block) {
          let placeholder = regexes.blockReplacement(block.name)
          let content = ''
          if (block.show) {
            content = this.renderBlock(block.content)
          }
          text = text.replace(placeholder, content)
        } else {
          console.warn(`RENDER: Block ${matches[1]} not found`)
        }
      }
    } while (matches)

    return text
  },
}

const utils = {
  blockExists (blocks, name) {
    for (let block of blocks) {
      if (block.name === name) {
        return block
      } else {
        let element = this.blockExists(block.blocks, name)
        if (element) return element
      }
    }

    return false
  },
  variableExists (variables, name) {
    const filtered = variables.filter(v => v.name === name)

    if (filtered.length > 0) return filtered[0]

    return false
  },
  escapeStringForRegex (string) {
    return string.replace(/([[\]()?.*$/\\])/g, `\\$1`)
  },
}

export default {
  data () {
    return {
      blocks: [],
      variables: [],
      source: '',
      preparedSource: '',
    }
  },
  methods: {
    parse (source) {
      const parserData = parser.parse(source)
      Vue.set(this, 'preparedSource', parserData.source)
      Vue.set(this, 'blocks', parserData.blocks)
      Vue.set(this, 'variables', parserData.variables)
    },
    render () {
      return renderer.render(this.preparedSource, this.blocks, this.variables)
    },
    findBlock: (blocks, name) => utils.blockExists(blocks, name),
  },
}
