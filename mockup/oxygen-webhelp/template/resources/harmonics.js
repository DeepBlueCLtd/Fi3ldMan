console.log('harmonics.js loaded');

const harmForm = `<div class=" wh_harmonics d-print-none ">
<strong>&#x1F50D; Harmonic Calculator 2 <input class="working" name="working" checked type="checkbox"/>On</strong>
  <form name="harmonics-form" on>
    <table>
      <tr><td style="width:100px">SR:<input name="sr" value=""/></td>
        <td class="obs" rowspan="2">Observed:<textarea name="obs" rows="3"></textarea></td>
      </tr>
      <tr><td>CSR:<input name="csr" value=""/></td></tr>
    </table>
    <input class="clear" name="clear" value="Clear" type="button"/>
  </form>
  <strong class="speed-head">Speed calculator</strong>
  <form class="speed-form">
    Speed:<input class='speed' /> <input type="button" value="Calc"/>
  </form>
</div>`

const FORM_KEY = 'harmonics-for-key'

const hCalc = {
  sigStable: undefined,
  sigRows: undefined,
  tpk: undefined,
  init: function() {
    if (!hCalc.sigsTable) {
      forEach(document.getElementsByTagName('table'), function(table) {
        if (table.getAttribute('data-cols')=== '6') {
          hCalc.sigsTable = table
          hCalc.processTable(table)
        }
      });
      // only insert the search form if this is a signatures page
      if (hCalc.sigsTable && hCalc.sigRows) {
        // find the div with the class 'wh_content_area', and insert the harmonics form at the end of it
        const contentArea = document.querySelector('.wh_content_area')
        if (contentArea) {
          contentArea.insertAdjacentHTML('beforeend', harmForm)
          // find the new harmonics form and attach event handlers to it
          const harmonicsForm = document.querySelector('.wh_harmonics')
          // retrieve the form values from local storage
          const formString = localStorage.getItem(FORM_KEY)
          hCalc.initialiseForm(harmonicsForm, formString)
          hCalc.addChangeHandlers(harmonicsForm)

              // also try the TPF value
          const row2 = hCalc.sigsTable.rows[1]
          const fifthCell = row2.cells[5]
          if (fifthCell.textContent) {
            const match = fifthCell.textContent.match(/(\d+(?:\.\d+)?)/)
            if (match) {
              hCalc.tpk = parseFloat(match)
            } else {
              // disable the calc button
              const calcButton = harmonicsForm?.querySelector('input[type="button"][value="Calc"]')
              const speedInput = harmonicsForm?.querySelector('.speed')
              if (calcButton) {
                // append a div error next to the calc button
                const errorDiv = document.createElement('span')
                errorDiv.classList.add('error')
                errorDiv.textContent = 'Disabled, TPK not found'
                // put the div into the parent cell, after the input control
                calcButton.parentNode.insertBefore(errorDiv, calcButton)
                // remove the calcButton
                calcButton.remove()
                speedInput.remove()
              }
            }
          }

        }
      }
    }
    if (hCalc.sigRows) {
      // find the harmonics div, with a classname of wh_harmonics
      const harmonicsDiv = document.querySelector('.wh_harmonics')
      const formValues = hCalc.getFormContents(harmonicsDiv)
      if (formValues) {
        hCalc.calcHarmonics(formValues, hCalc.sigRows)
      }
    }
  }, 
  enableForm: function(enabled) {
    // get the form
    const form = document.querySelector('.wh_harmonics')
    // get the inputs
    const cr = form.querySelector('input[name="csr"]')
    const sr = form.querySelector('input[name="sr"]')
    const obs = form.querySelector('textarea[name="obs"]')
    const clear = form.querySelector('input[name="clear"]')
    // set them enabled/disabled according to 'enabled'
    cr.disabled = !enabled
    sr.disabled = !enabled
    obs.disabled = !enabled
    clear.disabled = !enabled
},
  initialiseForm: function(form, formString) {
    if (formString) {
      const formValues = JSON.parse(formString)
      const cr = form.querySelector('input[name="csr"]')
      const sr = form.querySelector('input[name="sr"]')
      const obs = form.querySelector('textarea[name="obs"]')
      const working = form.querySelector('input[name="working"]')
      cr.value = formValues.csr || ''
      sr.value = formValues.sr || ''
      obs.value = formValues.obs || ''
      working.checked = formValues.working || true
    }
  },
  calcHarmonics: function(formValues, rows) {
    // loop through the rows
    forEach(rows, function(row) {
      // remove the table with class 'calc_harms', if it exists
      row.row.cells[2].querySelector('table.calc_harms')?.remove()
      // if the row has a class of 'match_row', remove that class
      row.row.classList.remove('match_row')
      if(!formValues.working) return
      // check we have relevant data
      const rowType = row.ratio.type
      if (rowType === 's' && !formValues.sr) return
      if (rowType === 'c' && !formValues.csr) return
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
        harmCell.textContent = 'H' + harm + ':'
        const scaledCell = document.createElement('td')
        const trimNumber = (num) => {
          return Math.round(num * 100) / 100
        }
        let scaledHarmonic = ''
        let matchesObs = false
        if (harm === '...') {
          harmCell.textContent = '...'
          scaledHarmonic = ''
        } else {
          switch(row.ratio.type) {
            case 's':
              scaledHarmonic = trimNumber(harm * row.ratio.value * formValues.sr)
              break
            case 'c':
              scaledHarmonic = trimNumber(harm * row.ratio.value * formValues.csr)
              break
            default: {
              scaledHarmonic = row.ratio.value.replace(/\d+(?:\.\d+)?/g, n => {
                const res = trimNumber(n*harm)
                const obsArray = formValues.obs
                if (obsArray.includes(res)) matchesObs = true
                return res
              })
            }
          }  
        }
        if (Array.isArray(formValues.obs) && formValues.obs.includes(scaledHarmonic)) {
          matchesObs = true
        }
        scaledCell.textContent = scaledHarmonic
        if (matchesObs) {
          row.row.classList.add('match_row')
          harmRow.classList.add('match_harmonic')
        }
        // add this cell to the row
        harmRow.appendChild(harmCell)
        harmRow.appendChild(scaledCell)
        // add the row to the table
        table.appendChild(harmRow)
      })
      // add the table to the row
      row.row.cells[2].appendChild(table)
      
    })
  },
  getFormContents: function(harmonicsDiv) {
    if (harmonicsDiv) {
      const checkField = function(field) {
        if (field.parentNode.querySelector('div.error')) {
          field.parentNode.querySelector('div.error')?.remove()
        }
        field.value = field.value.trim()
        if (field.value === '') return
        // use a regexp to check that the value is an integer, a decimal, or a series of comma/whitespace/newline separated numbers
        field.value = field.value.replace(/,/g, '')
        const re = /^[-+]?[0-9]*\.?[0-9]+(?:,[\s0-9]+)*$/
        if (!re.test(field.value)) {
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
      const working = harmonicsDiv.querySelector('input[name="working"]')

      // checkField(obs)
      // convert obs to a series of numbers separated by whitespace, newlines, or commas
      const obsValues = obs.value.split(/[,\s]+/).map(n => parseFloat(n))
      // strip out any values that aren't numbers
      const goodValues = obsValues.filter(n => !isNaN(n))
      const formValues = { csr: cr.value, sr: sr.value, obs: goodValues, working: working.checked }
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
      // special case for the clear button
      if (value === 'clear') {
        // find the new harmonics form and attach event handlers to it
        const harmonicsForm = document.querySelector('.wh_harmonics')
        // retrieve the form values from local storage
        const formString = JSON.stringify({})
        hCalc.initialiseForm(harmonicsForm, formString)
        // store formString in browser local storage
        localStorage.setItem(FORM_KEY, formString)  
      } else if (value === 'Calc') {
        const harmonicsForm = document.querySelector('.wh_harmonics')
        const speed = harmonicsForm?.querySelector('input.speed')
        const sr = harmonicsForm?.querySelector('input[name="sr"]')
        if (speed && sr) {
          if (speed.value && !sr.value) {
            sr.value = parseFloat(speed.value) / hCalc.tpk
          } else if (!speed.value && sr.value) {
            speed.value = parseFloat(sr.value) * hCalc.tpk
          } else {
            window.alert('One of Speed or SR must be empty')
          }
        }
      } else {
        // store the form contents in local storage
        const harmonicsDiv = document.querySelector('.wh_harmonics')
        const formValues = hCalc.getFormContents(harmonicsDiv)
        if (formValues) {
          // check if any form value is non-nully
          if(formValues.csr || formValues.sr || (formValues.obs &&  formValues.obs.length > 0)) {
            const formString = JSON.stringify(formValues)
            // store formString in browser local storage
            localStorage.setItem(FORM_KEY, formString)  
          }
        }
      }

      // enable/disable the form if the working checkbox is checked/unchecked
      if ([false, true].includes(value)) {   
        hCalc.enableForm(value)
      }

      hCalc.init()
    }
    // add change handler to each input and textarea
    forEach(inputs, function(input) {
      switch (input.type) {
        case 'checkbox':
          input.addEventListener('change', function(e) {
            handleInputChange(input.checked)
          })
          break
        case 'button':
          input.addEventListener('click', function(e) {
            handleInputChange(input.value)
          })
          break  
        default:
          input.addEventListener('keyup', function() {
            handleInputChange(input.value)
          })
      }
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
        sigRows.push({row: row, ratio: ratioText, harmonics: harmonics})
      }
    })
    hCalc.sigRows = sigRows
  },
  cleanRow: function(row) {
    // if the row contains a class value of 'match_row', remove that class value
    row.classList.remove('match_row')
    // if the third cell in the row contains a table with class 'calc_harms', remove it
    row.cells[2].querySelector('table.calc_harms')?.remove()
  },
  getRatioData: function(text) {
    // we have a special case where an item uses the construct `S1 or S3`.  Look for this, and ignore it
    if (text.toLowerCase().includes(' or ')) return

    // see if this cell contains the letter S followed by a number (including decimals)
    const match = text.match(/S(\d+(?:\.\d+)?)/)
    if (match) {
      return {type:'s', 'value': parseFloat(match[1])}
    }
    // see if this cell contains an integer or a decimal floating point number followed by ' x CSR'. If it does, extract the type and number
    let match1 = text.match(/(\d+(?:\.\d+)?) x CSR/)
    if (match1) {
      return {type:'c', 'value': parseFloat(match1[1])}
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