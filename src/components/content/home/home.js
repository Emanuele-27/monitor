import React, { useState } from "react";
import Chart from 'chart.js/auto';
import './home.css';
import { monitorClient, monitorStatClient, monitorAccountabilityClient } from 'clients/clients';

const chartOptions = {
    aspectRatio: 1,
    plugins: {
        legend: {
            display: false
        },
        tooltip: {
            bodyFont: {
                font: {
                    size: 16
                }
            }
        }
    }
};

const dataOK = {
    type: 'pie',
    data: {
        labels: [
            'Stato OK'
        ],
        datasets: [{
            data: [100],
            backgroundColor: [
                'rgba(0, 179, 0, 1)',
            ],
            borderColor: [
                'rgba(19, 255, 132, 1)',
            ],
            borderWidth: 1
        }]
    },
    options: chartOptions
};

const dataKO = {
    type: 'pie',
    data: {
        labels: [
            'Stato KO'
        ],
        datasets: [{
            data: [100],
            backgroundColor: [
                'rgba(204, 0, 0, 1)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
            ],
            borderWidth: 1
        }]
    },
    options: chartOptions
};

export default function Home(props) {

    const [builtChart, setBuiltChart] = useState(false);
    const [collapsed, setCollapsed] = useState(true);

    const buildCharts = (event) => {
        const isAccordionCollapsed = event.target.classList.contains('collapsed');
        setCollapsed(isAccordionCollapsed);
        // Crea i chart solo se il click espande l'accordion e se non sono già stati creati per quest'istanza
        if (!isAccordionCollapsed && !builtChart) {

            props.blockContent();

            Promise.all([monitorClient.welcomeTest(), monitorStatClient.welcomeTest(), monitorAccountabilityClient.welcomeTest()])
                .then(responses => {
                    buildChart('monitor-pie', responses[0] && responses[0].isOnline === true ? dataOK : dataKO);
                    buildChart('monitor-stat-pie', responses[1] && responses[1].isOnline === true ? dataOK : dataKO);
                    buildChart('monitor-acc-pie', responses[2] && responses[2].isOnline === true ? dataOK : dataKO);
                    setBuiltChart(true);
                })
                .finally(() => {
                    props.unblockContent();
                });
        }
    }

    const buildChart = (id, data) => {
        let chartStatus = Chart.getChart(id);
        if (chartStatus !== undefined)
            chartStatus.destroy();
        new Chart(id, data);
    }

    return (
        <>
            <div className="accordion" id="home-accordion">
                <div className="accordion-item">
                    <h3 className="accordion-header" id="home-accordion-heading">
                        <button id="home-accordion-button" className="accordion-button collapsed" onClick={buildCharts} type="button" data-bs-toggle="collapse" data-bs-target="#div-collapsible-1" aria-controls="div-collapsible-1">Monitor</button>
                    </h3>
                    <div id="div-collapsible-1" className="accordion-collapse collapse" aria-labelledby="home-accordion-heading" data-bs-parent="#home-accordion">
                        <div id="pies" className="accordion-body">
                            <div className="row">
                                <div className="col-12 col-md-6 col-xl-4">
                                    <h6>Monitor Service</h6>
                                    <canvas id="monitor-pie" className="pie-chart"></canvas>
                                </div>
                                <div className="col-12 col-md-6 col-xl-4">
                                    <h6>Monitor Stat Service</h6>
                                    <canvas id="monitor-stat-pie" className="pie-chart"></canvas>
                                </div>
                                <div className="col-12 col-md-6 col-xl-4">
                                    <h6>Monitor Accountability Service</h6>
                                    <canvas id="monitor-acc-pie" className="pie-chart"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {collapsed && (
                <div className="card card-horizontal" style={{ marginTop: "1rem" }} >
                    <div className="card-body">
                        <p className="card-text">
                            L'applicazione consente di monitorare lo stato delle transazioni e
                            permette di disporre delle funzionalità ausiliarie disponibili all'interno del Sistema pagoPA,
                            funzionalità accessorie per la gestione dei processi correlati alle operazioni di pagamento
                            che possono essere utilizzate dagli Enti Creditori (EC) per il rientro da situazioni anomale.
                        </p>
                    </div>
                </div>)}
        </>
    );
}