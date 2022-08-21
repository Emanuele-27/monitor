import { Link } from "react-router-dom";

/**
 * @param {{ 
 * route: string,
 * default: boolean
 * }} props Props for the component
 */

export const Entrypoint = (props) => {

    // Aggiunge o rimuove le classi per indicare il tab focused
    const toggleFocusClass = (ev) => {
        document.getElementById('tabs-row').getElementsByClassName('bg-primary')[0].classList.remove('bg-primary', 'text-white');
        ev.target.classList.add('bg-primary', 'text-white');
    }

    return <Link to={`/${props.route}`} onClick={toggleFocusClass} className={'btn btn-outline-primary btn-lg entrypoint ' + (props.default ? ' bg-primary text-white' : '')}>
        {props.children}
    </Link>

}