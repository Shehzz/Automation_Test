/// <reference types="cypress" />

describe('Automation Task', () => {
  it('Dropdown verification', () => {
    //iterating each value in the dropdown list using .each()
    cy.get('#dropdown-class-example option').each(($option) => {
      //each value of the dropdown options are stored in the optionValue variable
      const optionValue = $option.val()
      cy.get('#dropdown-class-example')
        //selecting each option available in the dropdown
        .select(optionValue)
        // Verify that the correct option is selected
        .should('have.value', optionValue)
    })
  })

  it('File Explorer verification', () => {
    //Uploading the test_image.jpg file using the selectFile method
    cy.get('.image-upload-wrapper > input').selectFile(
      'cypress/fixtures/test_image.jpg',
    )
    //Verifying if the image is visible once it has been uploaded
    cy.get('.image-upload-wrapper > img').should('exist')
  })

  it('Open a new tab verification', () => {
    //Validating the attribute and value of onClick as openTab() opens a new tab which is already defined in the task.html file
    cy.get('button#opentab').should(($button) => {
      expect($button).to.have.attr('onClick', 'openTab()')
    })

    //If there was no onClick function, I was going to remove the target attribute and open the URL in the same window and
    //verify the new URL and finally return back to the previous page
  })

  it('Invoking an alert/confirmation verification', () => {
    //1. Verifying for the Alert box using the alert-text.txt file

    cy.get('#alertbtn').then(($alertbutton) => {
      //Removing the attribute onclick which was going to call the method displayAlert()
      $alertbutton.removeAttr('onclick')

      //Using cy.task() reading the alert-text.txt file and invoking it inside the alert
      cy.task('readFile', 'cypress/fixtures/alert-text.txt').then(
        (fileContents) => {
          cy.wrap($alertbutton).click()

          //using cy.window() to get reference to the window and then using cy.stub() to manipulate the alert
          cy.window().then((win) => {
            cy.stub(win, 'alert').as('alertStub')
            win.alert(fileContents)
            cy.get('@alertStub').should('have.been.calledWith', fileContents)
          })
        },
      )
    })

    //2. Verifying for the Confirmation box using the input from the keyboard
    const inputText = 'test'
    cy.get('#name').type(inputText)

    cy.window().then((win) => {
      //Marking the cy.stub() to return as true so it closes the confirmation box by selecting "confirm"
      cy.stub(win, 'confirm').returns(true).as('confirmStub')
      cy.get('#confirmbtn').click()
      cy.get('@confirmStub').should(
        'have.been.calledWith',
        'Hello ' + inputText + ', Are you sure you want to confirm?',
      )
      cy.window().its('confirm').should('be.called')
    })
  })

  it('Show/Hide input verification', () => {
    //Initially the input is visible, so we verify that and click the hide button
    cy.get('#displayed-text').then(($visibilityCheck) => {
      cy.wrap($visibilityCheck).should('have.css', 'display', 'inline-block')
      cy.get('#hide-textbox').click()
      cy.wrap($visibilityCheck).should('have.css', 'display', 'none')

      // Once its verified that the input is hidden, we click the show button
      cy.get('#show-textbox').click()
      cy.wrap($visibilityCheck).should('have.css', 'display', 'block')
    })
  })

  it('Mouse hover verification', () => {
    const container = cy.get('.hover-container > button')

    //to check when the mouse is hovering
    container.trigger('mouseover')
    cy.get('.hover-content > a').should('be.visible')

    //to check when the mouse is not hovering
    container.trigger('mouseleave')
    cy.get('.hover-content > a').should('not.be.visible')
  })

  it('iFrame verification', () => {
    //finding the iFrame and making sure its visible and not empty
    cy.get('#courses-iframe')
      .should('be.visible')
      .should('not.be.empty')
      .then(($iframe) => {
        const $iframeBody = $iframe.contents().find('body')
        cy.wrap($iframeBody).should('contain', 'Easygenerator')
      })
  })
})
