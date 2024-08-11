import Link from "next/link";

export default function Home() {
  return (
    <>
      <nav class="navbar navbar-expand-lg bg-body-tertiary container">
        <div class="container-fluid">
            <Link class="navbar-brand" href="/">
                <img src="/img/sensor.png" alt="Logo" width="100" class="d-inline-block align-text-center"></img>
            </Link>
            <span>Dashboard Sensor Data</span>
            <button class="navbar-toggler collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="navbar-collapse justify-content-end collapse" id="navbarSupportedContent">
            <ul class="navbar-nav">
              <li class="nav-item">
                <Link class="nav-link btn btn-outline-primary mx-2" aria-current="page" href="/"><i class="fa-solid fa-house me-1" aria-hidden="true"></i>Dashboard</Link>
              </li>
              <li class="nav-item">
                <Link class="nav-link btn btn-outline-success" aria-current="page" href="/dataTable"><i class="fa-solid fa-house me-1" aria-hidden="true"></i>All Data</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
