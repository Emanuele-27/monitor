
/**
 * @param {{ 
 * header: string
 * }} props Props for the component
 */

export default function Accordion(props) {

    return <>
        <div className="accordion">
            <div className="accordion-item">
                <h3 className="accordion-header">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#div-collapsible-1" aria-controls="div-collapsible-1">
                        {props.header}
                    </button>
                </h3>
                <div id="div-collapsible-1" className="accordion-collapse collapse" aria-labelledby="rpt-accordion-heading">
                    <div className="accordion-body">
                        {props.children}
                    </div>
                </div>
            </div>
        </div>
    </>
}