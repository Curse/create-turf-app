import React from 'react'
import ReactDOM from 'react-dom'
import forEach from 'lodash/forEach'
import ready from 'document-ready'

const rootEls = document.querySelectorAll('[data-component="<%= name %>"]')

function App(props) {
  return <div {...props}>Hello Sir, and or Madam</div>
}

ready(() => {
  forEach(rootEls, (el) => {
    const props = {
      ...JSON.parse(el.dataset.props || '{}'),
      ...el.dataset,
    }

    ReactDOM.render(<App {...props}/>, el)
  })
})
