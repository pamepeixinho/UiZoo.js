import './index.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'underscore';
import { BrowserRouter, Route } from 'react-router-dom';

import libraryData from './components';
import libraryDocs from './documentation';
import { checkDependencies } from './services/checkHealth';
import { createCompiler } from './services/compileWithContext';
import { parseDocumentation } from './services/parseDocumentation';
import App from './Components/App';
import mapComponentsByModule from './services/componentByModuleMapper';

window._extend = _.extend; // to be used instead of Object.assign

/**
 * Init - render UiZoo with documentation and components mappings
 * @param {Object} [documentation]
 * @param {Object} [components]
 * @param {HTMLElement} [rootElement] will default to a new element on the body
 */
function init(
    documentation = libraryDocs,
    components = libraryData,
    rootElement,
    baseRoute = '/',
    home,
) {
    if (!rootElement) {
        rootElement = document.createElement('div');
        document.body.appendChild(rootElement);
    }
    checkDependencies(documentation, components);

    const compiler = createCompiler(components); // JSX compiler
    const documentations = parseDocumentation(documentation);
    const componentsByModule = mapComponentsByModule(components, documentations);

    ReactDOM.render(
        <BrowserRouter basename="/">
            <Route path={`${baseRoute}:componentName?/:exampleIndex?`} render={routeProps => (
                <App {...routeProps}
                    components={components}
                    componentsByModule={componentsByModule}
                    documentations={documentations}
                    compiler={compiler}
                    baseRoute={baseRoute}
                    home={home}
                />
            )}
            />
        </BrowserRouter>,
        rootElement
    );
}

export default { init };