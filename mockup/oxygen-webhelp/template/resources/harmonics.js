console.log('harmonics.js loaded');

const harmForm = `<div class=" wh_harmonics d-print-none ">
<strong>Harmonic Calculator 2 &#x1F50D;</strong>
  <form name="harmonics-form" on>
    <table>
      <tr><td style="width:100px">SR:<input name="sr" value="5"/></td>
        <td class="obs" rowspan="2">Observed:<textarea name="obs" rows="3">180
34.6
6651.84
</textarea></td>
      </tr>
      <tr><td>CSR:<input name="csr" value="12.3"/></td></tr>
    </table>   
  </form>
</div>`

const hCalc = {
  sigStable: undefined,
  sigRows: undefined,
  init: function() {
    if (!hCalc.sigsTable) {
      forEach(document.getElementsByTagName('table'), function(table) {
        if (table.getAttribute('data-cols')=== '6') {
          hCalc.sigsTable = table
          hCalc.processTable(table)
        }
      });  
      // remove the harmonics form, if it exists
      document.querySelector('form[name="harmonics-form"]')?.remove()

      // find the div with the class 'wh_content_area', and insert the harmonics form at the end of it
      const contentArea = document.querySelector('.wh_content_area')
      if (contentArea) {
        console.log('contentArea found')
        contentArea.insertAdjacentHTML('beforeend', harmForm)
        // find the new harmonics form and attach event handlers to it
        const harmonicsForm = document.querySelector('form[name="harmonics-form"]')
        hCalc.addChangeHandlers(harmonicsForm)
      }
    }
    if (hCalc.sigRows) {
      // find the harmonics div, with a classname of wh_harmonics
      const harmonicsDiv = document.querySelector('.wh_harmonics')
      const formValues = hCalc.getFormContents(harmonicsDiv)
      if (formValues) {
        hCalc.calcHarmonics(formValues, hCalc.sigRows)
      }
      console.log('formValues', formValues)
    }
  }, 
  calcHarmonics: function(formValues, rows) {
    // loop through the rows
    forEach(rows, function(row) {
      // create a table element
      const table = document.createElement('table')
      // add the class 'calc_harms'
      table.classList.add('calc_harms')
      // loop through the harmonics in this row
      forEach(row.harmonics, function(harm) {
        // create a row for this harmonic
        const harmRow = document.createElement('tr')
        // create a cell for this harmonic
        const harmCell = document.createElement('td')
        // add the harmonic to this cell
        harmCell.textContent = harm
        // add this cell to the row
        harmRow.appendChild(harmCell)
        // add the row to the table
        table.appendChild(harmRow)
      })
      // add the table to the row
      console.log('row', row, row.cells, row.children)
      
    })
  },
  getFormContents: function(harmonicsDiv) {
    if (harmonicsDiv) {
      const checkField = function(field) {
        if (field.parentNode.querySelector('div.error')) {
          field.parentNode.querySelector('div.error')?.remove()
        }
        field.value = field.value.trim()
        // use a regexp to check that the value is an integer, a decimal, or a series of comma/whitespace/newline separated numbers
        field.value = field.value.replace(/,/g, '')
        const re = /^[-+]?[0-9]*\.?[0-9]+(?:,[\s0-9]+)*$/
        if (!re.test(field.value)) {
          console.log(`${field.value} not a number`)
          // create an error div element
          const errorDiv = document.createElement('div')
          errorDiv.classList.add('error')
          errorDiv.textContent = 'invalid'
          // put the div into the parent cell, after the input control
          field.parentNode.insertBefore(errorDiv, field)
        }
      }
      // extract the values of the input controls in the table, in the harmonics div
      const cr = harmonicsDiv.querySelector('input[name="csr"]')
      const sr = harmonicsDiv.querySelector('input[name="sr"]')
      const obs = harmonicsDiv.querySelector('textarea[name="obs"]')
      checkField(cr)
      checkField(sr)
      // checkField(obs)
      // convert obs to a series of numbers separated by whitespace, newlines, or commas
      const obsValues = obs.value.split(/[,\s]+/).map(n => parseFloat(n))
      // strip out any values that aren't numbers
      const goodValues = obsValues.filter(n => !isNaN(n))
      const formValues = { csr: cr.value, sr: sr.value, obs: goodValues }
      return formValues
    } else {
      return undefined
    }
  },
  addChangeHandlers: function(form) {
    // find the inputs and text areas in this form
    const inputs = form.querySelectorAll('input')
    const textareas = form.querySelectorAll('textarea')
    const handleInputChange = function(value) {
      if (parseFloat(value)) {
        console.log('parsed', value)
        // trigger 'init'
        hCalc.init()
      } else {
        console.log('unable to parse', value)
      }
    }
    // add change handler to each input and textarea
    forEach(inputs, function(input) {
      input.addEventListener('keyup', function() {
        handleInputChange(input.value)
      })
    })
    forEach(textareas, function(textarea) {
      textarea.addEventListener('keyup', function() {
        handleInputChange(textarea.value)
      })
    })
  }, 
  processTable: function(table) {
    // loop through table rows
    const sigRows = []
    forEach(table.rows, function(row) {
      // check if row consists of 4 cells
      if (row.cells.length === 4) {
        hCalc.cleanRow(row)
        let ratioText = undefined
        const ratioCell = row.cells[1]
        // see if this cell contains any digits, allowing for S prefix, decimals and ranges
        if (/\d/.test(ratioCell.textContent)) {
          ratioText = hCalc.getRatioData(ratioCell.textContent)
        }
        // only process rest of row if we have ratio text
        if (!ratioText) return
        const harmCell = row.cells[2]
        // if this cell contains a table with class 'calc_harms', remove that table
        if (harmCell.querySelector('table.calc_harms')) {
          harmCell.querySelector('table.calc_harms').remove()
        }
        // this cell contains a series of harmonics separated by commas, or as ranges between two numbers. Extract the single values, and the ranges as pairs of numbers
        const harmonics = hCalc.getHarmonicsData(harmCell.textContent)
        // console.log(ratioText)
        sigRows.push({row: row, ratio: ratioText, harmonics: harmonics})
      }
    })
    console.log('rows', sigRows)
    hCalc.sigRows = sigRows
  },
  cleanRow: function(row) {
    // if the row contains a class value of 'match_row', remove that class value
    row.classList.remove('match_row')
    // if the third cell in the row contains a table with class 'calc_harms', remove it
    row.cells[2].querySelector('table.calc_harms')?.remove()
  },
  getRatioData: function(text) {
    // see if this cell contains the letter S followed by a number (including decimals)
    const match = text.match(/S(\d+(?:\.\d+)?)/)
    if (match) {
      return {type:'s', 'value': parseFloat(match[1])}
    }
    // see if this cell contains a number followed by ' x CSR'. If it does, extract the type and number
    let match2 = text.match(/(\d+) x CSR/)
    if (match2) {
      return {type:'c', 'value': parseInt(match2[1])}
    }
    // extract all numbers from the text using regex
    // const matches = text.match(/\d+(?:\.\d+)?/g) || []
    // replace each match in `text` with the number squared.
    // const text2 = text.replace(/\d+(?:\.\d+)?/g, n => n*n)
    return {type: 'a',  value: text}
  }, getHarmonicsData: function(text) {
    const result = []
    let lastIndex = 0
    
    // Find all numbers and ranges in order of appearance
    const pattern = /(\d+)(?:\s*-\s*(\d+))?/g
    let match
    
    while ((match = pattern.exec(text)) !== null) {
      if (match[2]) {
        // This is a range. So, we must push each value in the range to the array.
        // If there are more than 6 items in the range, push the first 5, plus the last value.
        if (match[2] - match[1] > 6) {
          const rangeStart = parseInt(match[1])
          const rangeEnd = parseInt(match[2])
          for (let i = rangeStart; i < rangeStart + 5; i++) {
            result.push(i)
          }
          result.push('...')
          result.push(rangeEnd)
        } else {
          for (let i = match[1]; i <= match[2]; i++) {
            result.push(parseInt(i))
          }
        }
      } else {
        // This is a single number
        result.push(parseInt(match[1]))
      }
    }
    
    return result
  }
}

/* for other browsers */
window.onload = hCalc.init;