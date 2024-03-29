import React, { useEffect, useState } from "react";
import Chart from 'chart.js/auto';
import './home.css';
import { monitorClient } from "clients/monitor-client";
import { monitorStatClient } from "clients/monitor-stat-client";
import { monitorAccountabilityClient } from "clients/monitor-accountability-client";

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

export default function Home() {

    const [collapsed, setCollapsed] = useState(true);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const getStats = async () => {
            const res = await Promise.allSettled([monitorClient.welcomeTest(), monitorStatClient.welcomeTest(), monitorAccountabilityClient.welcomeTest()]);
            const respObj = {
                monitor: res[0],
                monitorStat: res[1],
                monitorAcc: res[2]
            };
            setStats(respObj);
        }
        getStats();
    }, [])

    const handleCollpse = (e) => {

        const isCollapsed = e.target.classList.contains('collapsed');
        setCollapsed(isCollapsed);

        if (!isCollapsed) {
            buildChart('monitor-pie', stats.monitor && stats.monitor.value && stats.monitor.value.isOnline ? dataOK : dataKO);
            buildChart('monitor-stat-pie', stats.monitorStat && stats.monitorStat.value && stats.monitorStat.value.isOnline ? dataOK : dataKO);
            buildChart('monitor-acc-pie', stats.monitorAcc && stats.monitorAcc.value && stats.monitorAcc.value.isOnline ? dataOK : dataKO);
        }
    }

    const buildChart = (id, data) => {
        const chartStatus = Chart.getChart(id);
        if (chartStatus)
            chartStatus.destroy();
        new Chart(id, data);
    }

    return (
        <div className="container">
            <div className="accordion" id="home-accordion">
                <div className="accordion-item">
                    <h3 className="accordion-header" id="home-accordion-heading">
                        <button id="home-accordion-button" className="accordion-button collapsed" onClick={handleCollpse} type="button" data-bs-toggle="collapse" data-bs-target="#div-collapsible-1" aria-controls="div-collapsible-1">Monitor</button>
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
            {collapsed
                && (
                    <div className="card card-horizontal" style={{ marginTop: "1rem" }} >
                        <div className="card-body">
                            <p className="card-text">
                                L'applicazione consente di monitorare lo stato delle transazioni e
                                permette di disporre delle funzionalità ausiliarie disponibili all'interno del Sistema pagoPA,
                                funzionalità accessorie per la gestione dei processi correlati alle operazioni di pagamento
                                che possono essere utilizzate dagli Enti Creditori (EC) per il rientro da situazioni anomale.
                            </p>
                        </div>
                    </div>)
            }
        </div >

    );
}