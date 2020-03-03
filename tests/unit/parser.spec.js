import { expect } from 'chai'
import parserMixin from '@/mixins/parser.js'

const parser = parserMixin.methods
const emptyContent = '________'

describe('Parser mixin - Variables', () => {
  it('parses variables when variable starts the line', () => {
    const source = '[TEXT SOME_VAR The test var] Some text'
    parser.parse(source)
    expect(parser.variables.length).to.eq(1)
    expect(parser.variables[0]).to.eql({
      content: emptyContent,
      description: 'The test var',
      name: 'SOME_VAR',
      type: 'TEXT',
    })
    expect(parser.preparedSource).to.eq('[~SOME_VAR] Some text')
  })
  it('parses variables when variable ends the line', () => {
    const source = 'Some text [TEXT SOME_VAR The test var]'
    parser.parse(source)
    expect(parser.variables.length).to.eq(1)
    expect(parser.variables[0]).to.eql({
      content: emptyContent,
      description: 'The test var',
      name: 'SOME_VAR',
      type: 'TEXT',
    })
    expect(parser.preparedSource).to.eq('Some text [~SOME_VAR]')
  })
  it('parses variables when variable follows another', () => {
    const source = '[TEXT SOME_VAR The test var][SOME_VAR]'
    parser.parse(source)
    expect(parser.variables.length).to.eq(1)
    expect(parser.variables[0]).to.eql({
      content: emptyContent,
      description: 'The test var',
      name: 'SOME_VAR',
      type: 'TEXT',
    })
    expect(parser.preparedSource).to.eq('[~SOME_VAR][~SOME_VAR]')
  })

  it('does not redefine vars if already defined', () => {
    const source = '[TEXT SOME_VAR The test var][STRING SOME_VAR Redefined var]'
    parser.parse(source)
    expect(parser.variables.length).to.eq(1)
    expect(parser.variables[0]).to.eql({
      content: emptyContent,
      description: 'The test var',
      name: 'SOME_VAR',
      type: 'TEXT',
    })
    expect(parser.preparedSource).to.eq('[~SOME_VAR][~SOME_VAR]')
  })
  it('defines a default type for vars with no type', () => {
    const source = '[SOME_VAR The test var]'
    parser.parse(source)
    expect(parser.variables[0]).to.eql({
      content: emptyContent,
      description: 'The test var',
      name: 'SOME_VAR',
      type: 'STRING',
    })
  })
  it('defines variables with no description', () => {
    const source = '[TEXT SOME_VAR]'
    parser.parse(source)
    expect(parser.variables[0]).to.eql({
      content: emptyContent,
      description: '',
      name: 'SOME_VAR',
      type: 'TEXT',
    })
  })
  it('defines variables with no type nor description', () => {
    const source = '[SOME_VAR]'
    parser.parse(source)
    expect(parser.variables[0]).to.eql({
      content: emptyContent,
      description: '',
      name: 'SOME_VAR',
      type: 'STRING',
    })
  })
  it('redefines variables if second definition has description and the first don\'t', () => {
    const source = '[FAIL][TEXT FAIL This is some var]'
    parser.parse(source)
    expect(parser.variables.length).to.eq(1)
    expect(parser.variables[0]).to.eql({
      content: emptyContent,
      description: 'This is some var',
      name: 'FAIL',
      type: 'TEXT',
    })
  })

  it('renders variables when variable starts the line', () => {
    const source = '[STRING VAR The var] Some text'
    parser.parse(source)
    expect(parser.render()).to.eq(`${emptyContent} Some text`)
  })
  it('renders variables when variable ends the line', () => {
    const source = 'Some text [STRING VAR The var]'
    parser.parse(source)
    expect(parser.render()).to.eq(`Some text ${emptyContent}`)
  })
  it('renders multiple variables on the same line', () => {
    const source = '[STRING VAR The var] [STRING OTHER The other var]'
    parser.parse(source)
    expect(parser.render()).to.eq(`${emptyContent} ${emptyContent}`)
  })
  it('keeps declaration order when none of the names starts with a number', () => {
    const source = '[STRING VAR The var] [STRING OTHER The other var]'
    parser.parse(source)
    expect(parser.variables[0].name).to.eq('VAR')
  })

  it('orders variables if one of the names starts with a number', () => {
    const source = '[STRING VAR The var] [STRING 1_OTHER The other var]'
    parser.parse(source)
    expect(parser.variables[0].name).to.eq('1_OTHER')
  })
})

describe('Parser mixin - Blocks', () => {
  it('parses blocks', () => {
    const source = '[[BLOCK THE_BLOCK] The description]Some text[[END THE_BLOCK]]'
    parser.parse(source)
    expect(parser.blocks.length).to.eq(1)
    expect(parser.preparedSource).to.eq('[[THE_BLOCK]]')
  })
  it('parses nested blocks', () => {
    const source = '[[BLOCK THE_BLOCK] A block][[BLOCK SUB] A sub-block]Some text[[END SUB]][[END THE_BLOCK]]'
    parser.parse(source)
    expect(parser.blocks.length).to.eq(1)
    expect(parser.blocks[0].blocks.length).to.eq(1)
    expect(parser.preparedSource).to.eq('[[THE_BLOCK]]')
    expect(parser.blocks[0].content).to.eq('[[SUB]]')
  })
  it('throws errors when block definition is not closed', () => {
    const source = '[[BLOCK THE_BLOCK] A bad block]Some text'
    parser.parse(source)
    expect(parser.blocks.length).to.eq(0)
    expect(parser.preparedSource).to.eq('**[[ERROR: THE_BLOCK has no end]]**Some text')
  })
  it('throws errors when blocks include themselves', () => {
    const source = '[[BLOCK THE_BLOCK] A bad block][[THE_BLOCK]]Content[[END THE_BLOCK]]'
    parser.parse(source)
    expect(parser.blocks.length).to.eq(1)
    expect(parser.blocks[0].blocks.length).to.eq(0)
    expect(parser.preparedSource).to.eq('[[THE_BLOCK]]')
    expect(parser.blocks[0].content).to.eq('**[[ERROR: THE_BLOCK cannot be nested in itself]]**Content')
  })
  it('don\'t work without a description', () => {
    const source = '[[BLOCK THE_BLOCK]]Block content[[END THE_BLOCK]]'
    parser.parse(source)
    expect(parser.render()).to.eq('[[BLOCK THE_BLOCK]]Block content[[END THE_BLOCK]]')
  })
})

describe('Parser mixin - Conditional', () => {
  it('renders a block if enabled', () => {
    const source = '[[BLOCK THE_BLOCK] A block]Block content[[END THE_BLOCK]][[IF THE_BLOCK]]Conditionally displayed[[ENDIF THE_BLOCK]]Normal content'
    parser.parse(source)
    parser.blocks[0].show = true
    expect(parser.render()).to.eq('Block contentConditionally displayedNormal content')
  })
  it('don\'t renders a block if disabled', () => {
    const source = '[[BLOCK THE_BLOCK] A block]Block content[[END THE_BLOCK]][[IF THE_BLOCK]]Conditionally displayed[[ENDIF THE_BLOCK]]Normal content'
    parser.parse(source)
    parser.blocks[0].show = false
    expect(parser.render()).to.eq('Normal content')
  })
  it('works in blocks', () => {
    const source = '[[BLOCK THE_BLOCK] A block]Block content[[END THE_BLOCK]][[BLOCK OTHER] Other block]Other content[[IF THE_BLOCK]]Conditionally displayed[[ENDIF THE_BLOCK]][[END OTHER]]Normal content'
    parser.parse(source)
    parser.blocks[0].show = true
    expect(parser.render()).to.eq('Block contentOther contentConditionally displayedNormal content')
    parser.blocks[0].show = false
    expect(parser.render()).to.eq('Other contentNormal content')
  })
  it('works in sub blocks', () => {
    const source = '[[BLOCK THE_BLOCK] A block]Block content[[END THE_BLOCK]][[BLOCK OTHER] Other block]Other content[[BLOCK SUB] Sub block]Sub content[[IF THE_BLOCK]]Conditionally displayed[[ENDIF THE_BLOCK]][[END SUB]][[END OTHER]]Normal content'
    parser.parse(source)
    parser.blocks[0].show = true
    expect(parser.render()).to.eq('Block contentOther contentSub contentConditionally displayedNormal content')
    parser.blocks[0].show = false
    expect(parser.render()).to.eq('Other contentSub contentNormal content')
  })
})

describe('Parser mixin - Numbering', () => {
  it('increments logically', () => {
    const source = '[#] [##] [#] [##] [###] [##] [#] [###]'
    parser.parse(source)
    expect(parser.render()).to.eq('1 1.1 2 2.1 2.1.1 2.2 3 3.0.1')
  })
  it('increments logically in blocks', () => {
    const source = '[#] [[BLOCK SOME] Some block][##] Some content[[END SOME]] [#]'
    parser.parse(source)
    expect(parser.render()).to.eq('1 1.1 Some content 2')
  })
  it('increments logically with disabled blocks', () => {
    const source = '[#] [[BLOCK SOME] Some block][##] Some content[[END SOME]] [#]'
    parser.parse(source)
    parser.blocks[0].show = false
    expect(parser.render()).to.eq('1  2')
  })
  it('increments logically with repeated blocks', () => {
    const source = '[#] [[BLOCK SOME] Some block][##] Some content[[END SOME]] [#] [[SOME]]'
    parser.parse(source)
    expect(parser.render()).to.eq('1 1.1 Some content 2 2.1 Some content')
  })
})

describe('Parser - Shortcodes', () => {
  it('renders valid shortcodes', () => {
    const source = '[~~DATE_YEAR]'
    parser.parse(source)
    expect(parser.render()).to.eq(`${(new Date()).getFullYear()}`)
  })
  it('renders an error for invalid shortcodes', () => {
    const source = '[~~UNKNOWN]'
    parser.parse(source)
    expect(parser.render()).to.eq('**[ERROR: ~~UNKNOWN is not a valid shortcode]**')
  })
})
