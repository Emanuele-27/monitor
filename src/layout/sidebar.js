import React, { Component } from "react";


class Sidebar extends Component {
    render() {
        return (
            <nav aria-label="Menu della sezione ...">
                <div class="sidebar-header bg-primary text-white">
                    <h1 class="sidebar-title">Menu<span class="visually-hidden"> della sezione ...</span>
                    </h1>
                    <button type="button" class="navbar-toggler collapsed d-block d-lg-none" data-bs-toggle="collapse" data-bs-target="#sidebar-menu" aria-controls="sidebar-menu" aria-expanded="false">
                        <span class="visually-hidden">Apri menu della sezione ...</span>
                        <i class="bi bi-list text-white"></i>
                    </button>
                </div>
                <div class="sidebar sidebar-expand-lg sidebar-dark">
                    <div class="sidebar-collapse collapse" id="sidebar-menu">
                        <ul class="nav">
                            <li class="nav-item">
                                <a class="nav-link" href="#">Voce</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#">Voce attiva</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

export default Sidebar;