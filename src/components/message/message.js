import 'components/message/message.css';
import { useEffect } from 'react';

/**
 * @param {{ 
 * id: string,
 * summary: string,
 * detail: string,
 * show: boolean,
 * onHide: function
 * }} props Props for the component
 */

export const Message = (props) => {

    useEffect(() => {
        document.getElementById(props.id).scrollIntoView({ behavior: "smooth", block: "center" });
    }, [props]);

    return <div className="container">
        <div id={props.id} className={'alert alert-' + props.severity + ' alert-dismissible fade show ' + (props.show ? '' : 'hidden')} role="alert">
            <b>{props.summary + " "}</b>
            {props.detail}
            <button type="button" onClick={props.onHide} className="btn-close" aria-label="Chiudi"></button>
        </div>
    </div>
}

export const Severities = {
    success: "success",
    info: "info",
    warn: "warning",
    error: "danger"
}

export const messageDefault = {
    severity: Severities.info,
    summary: '',
    detail: '',
    show: false,
}

Message.defaultProps = messageDefault