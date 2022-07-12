import React, { Component } from "react";
import Chart from 'chart.js/auto';
import './home.css';
import { monitorClient, monitorStatClient, monitorAccountabilityClient } from 'clients/clients';

class Home extends Component {


    constructor(props) {
        super(props)
        this.dataKO = {
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
            options: {
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
            }
        };
        this.dataOK = {
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
            options: {
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
            }
        };

        this.createdCharts = false;

        this.createCharts = this.createCharts.bind(this);
        this.createChart = this.createChart.bind(this);
    }

    async createCharts(event) {

        // Crea i chart solo se il click espande l'accordion e se non sono già stati creati per quest'istanza
        if (!event.target.classList.contains('collapsed') && !this.createdCharts) {

            this.createdCharts = true;

            this.props.blockContent();

            const monitorStatus = await monitorClient.welcomeTest();
            const monitorStatStatus = await monitorStatClient.welcomeTest();
            const monitorAccountabilityStatus = await monitorAccountabilityClient.welcomeTest();

            this.createChart('monitor-pie', monitorStatus && monitorStatus.isOnline === true ? this.dataOK : this.dataKO);
            this.createChart('monitor-stat-pie', monitorStatStatus && monitorStatStatus.isOnline === true ? this.dataOK : this.dataKO);
            this.createChart('monitor-acc-pie', monitorAccountabilityStatus && monitorAccountabilityStatus.isOnline === true ? this.dataOK : this.dataKO);

            this.props.unblockContent();
        }
    }

    createChart(id, data) {
        let chartStatus = Chart.getChart(id);
        if (chartStatus !== undefined)
            chartStatus.destroy();
        new Chart(id, data);
    }

    render() {
        return (
            <div>
                <div className="accordion" id="home-accordion">
                    <div className="accordion-item">
                        <h3 className="accordion-header" id="home-accordion-heading">
                            <button className="accordion-button collapsed" onClick={this.createCharts} type="button" data-bs-toggle="collapse" data-bs-target="#div-collapsible-1" aria-controls="div-collapsible-1">Monitor</button>
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

                <div className="card card-horizontal" style={{ marginTop: "1rem" }}>
                    <div className="card-body">
                        <p className="card-text">
                            L'applicazione consente di monitorare lo stato delle transazioni e
                            permette di disporre delle funzionalità ausiliarie disponibili all'interno del Sistema pagoPA,
                            funzionalità accessorie per la gestione dei processi correlati alle operazioni di pagamento
                            che possono essere utilizzate dagli Enti Creditori (EC) per il rientro da situazioni anomale.
                        </p>
                    </div>
                </div>

            </div >
        );
    }
}

export default Home;