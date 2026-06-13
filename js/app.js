const photos = {
      Madrid: {
        title: "Plaza Mayor, Madrid",
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Plaza%20Mayor%20de%20Madrid%2006.jpg?width=1200",
        alt: "Plaza Mayor de Madrid al atardecer",
        credit: "Wikimedia Commons, Plaza Mayor de Madrid 06",
        href: "https://commons.wikimedia.org/wiki/File:Plaza_Mayor_de_Madrid_06.jpg"
      },
      Granada: {
        title: "Albaicin desde la Alhambra",
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/View%20of%20Albaic%C3%ADn%20from%20Alhambra.%20Granada%2C%20Spain.jpg?width=1200",
        alt: "Vista del Albaicin desde la Alhambra en Granada",
        credit: "Wikimedia Commons, View of Albaicin from Alhambra",
        href: "https://commons.wikimedia.org/wiki/File:View_of_Albaic%C3%ADn_from_Alhambra._Granada,_Spain.jpg"
      },
      Cordoba: {
        title: "Puente Romano y Mezquita-Catedral",
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Puente%20romano%20y%20Mezquita-Catedral.jpg?width=1200",
        alt: "Puente Romano y Mezquita-Catedral de Cordoba",
        credit: "Emilio Garcia via Wikimedia Commons",
        href: "https://commons.wikimedia.org/wiki/File:Puente_romano_y_Mezquita-Catedral.jpg"
      },
      Toledo: {
        title: "Toledo desde Zocodover",
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/View%20of%20the%20Alcazar%2C%20Toledo%20%28Spain%29%2C%20from%20Zocodover.jpg?width=1200",
        alt: "Vista del Alcazar de Toledo desde Zocodover",
        credit: "Heparina1985 via Wikimedia Commons",
        href: "https://commons.wikimedia.org/wiki/File:View_of_the_Alcazar,_Toledo_(Spain),_from_Zocodover.jpg"
      },
      "Alcala de Henares": {
        title: "Plaza Cervantes, Alcala de Henares",
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Plaza%20Cervantes%2C%20Alcal%C3%A1%20de%20Henares.JPG?width=1200",
        alt: "Plaza Cervantes en Alcala de Henares",
        credit: "Wikimedia Commons, Plaza Cervantes",
        href: "https://commons.wikimedia.org/wiki/File:Plaza_Cervantes,_Alcal%C3%A1_de_Henares.JPG"
      },
      Letras: {
        title: "Barrio de las Letras",
        src: "https://commons.wikimedia.org/wiki/Special:FilePath/Barrio%20de%20las%20Letras%20%28Madrid%29%2001.jpg?width=1200",
        alt: "Calles del Barrio de las Letras en Madrid",
        credit: "Wikimedia Commons, Barrio de las Letras",
        href: "https://commons.wikimedia.org/wiki/File:Barrio_de_las_Letras_(Madrid)_01.jpg"
      }
    };

    const mapSteps = [
      { city: "Madrid", date: "27-28 May", activity: "Arrival, rest and first orientation in Madrid.", mode: "Arrival", tags: ["Arrival", "Orientation"], path: null },
      { city: "Granada", date: "28-30 May", activity: "Train / AVE south. Alhambra, historic centre and possible Albaicin or Sacromonte activity.", mode: "Train / AVE", tags: ["Train / AVE", "Alhambra"], path: "rail-mad-grx" },
      { city: "Cordoba", date: "30-31 May", activity: "Train from Granada. Mezquita-Catedral, Juderia, Puente Romano and short academic stop.", mode: "Train / AVE", tags: ["Train / AVE", "Heritage"], path: "rail-grx-cord" },
      { city: "Madrid", date: "31 May-9 June", activity: "Return by train to the main final base. Madrid historico, Prado, Letras, markets and closing work.", mode: "Train / AVE", tags: ["Train / AVE", "Main base"], path: "rail-cord-mad" },
      { city: "Alcala de Henares", date: "3 June", activity: "Day trip for university visit, Cervantes context and possible intercultural encounter.", mode: "Day trip", tags: ["Day trip", "University"], path: "day-mad-alc", returnPath: "day-alc-mad" },
      { city: "Toledo", date: "4 June", activity: "Day trip on heritage, convivencia, conflict, tourism and historical memory.", mode: "Day trip", tags: ["Day trip", "Heritage"], path: "day-mad-tol", returnPath: "day-tol-mad" }
    ];

    const dayItems = [
      { date: "26 May", city: "Flight", title: "Vuelo Hong Kong-Madrid", desc: "Salida de Hong Kong. Vuelo internacional en clase economica, con vuelo directo si el precio es razonable o una escala si reduce costes.", task: "Recordatorio: guardar boarding passes y documentos de viaje." },
      { date: "27 May", city: "Madrid", title: "Llegada y orientacion suave", desc: "Traslado al alojamiento, check-in o consigna, descanso inicial y orientacion breve por el entorno.", task: "Localizar supermercado, transporte cercano, punto de encuentro y normas basicas." },
      { date: "28 May", city: "Madrid / Granada", title: "Madrid-Granada", desc: "Viaje en tren rapido/AVE u opcion ferroviaria equivalente. Llegada, check-in y primera orientacion por el centro.", task: "Observar diferencias entre estacion, centro historico y vida cotidiana." },
      { date: "29 May", city: "Granada", title: "Alhambra y legado andalusi", desc: "Actividad central del viaje. Reserva prioritaria para Alhambra y Palacios Nazaries si se consigue disponibilidad.", task: "Observar agua, jardines, escritura, decoracion, poder, memoria y turismo patrimonial." },
      { date: "30 May", city: "Granada / Cordoba", title: "Albaicin/Sacromonte breve y traslado", desc: "Actividad ligera en Granada si el horario lo permite. Traslado en tren a Cordoba y orientacion por el centro.", task: "Documentar barrios, turismo, identidad y memoria cultural." },
      { date: "31 May", city: "Cordoba / Madrid", title: "Mezquita-Catedral y regreso", desc: "Visita a la Mezquita-Catedral y ruta breve por Juderia, Puente Romano y entorno del rio. Tren a Madrid por la tarde.", task: "Comparar arquitectura, simbolos y reutilizacion historica de espacios." },
      { date: "1 June", city: "Madrid", title: "Madrid historico: Austrias y vida urbana", desc: "Plaza Mayor, calle Mayor, Plaza de la Villa, Almudena exterior y Palacio Real exterior.", task: "Comparar la plaza espanola con espacios urbanos de Hong Kong." },
      { date: "2 June", city: "Madrid", title: "Barrio de las Letras, Prado y cultura visual", desc: "Cervantes, Lope de Vega, memoria literaria, ciudad y seleccion breve de obras del Prado.", task: "Relacionar obra, ciudad, memoria y vocabulario visual." },
      { date: "3 June", city: "Alcala de Henares", title: "Universidad, Cervantes y encuentro intercultural", desc: "Excursion de dia desde Madrid con foco en ciudad universitaria historica y contacto academico ligero.", task: "Preparar preguntas sencillas para el encuentro universitario si se confirma." },
      { date: "4 June", city: "Toledo", title: "Patrimonio, historia y convivencia cultural", desc: "Zocodover, casco historico, Catedral exterior o interior segun presupuesto, barrio judio y mirador si es viable.", task: "Analizar como la ciudad presenta convivencia, conflicto y turismo." },
      { date: "5 June", city: "Madrid", title: "Mercados, Lavapies y cultura urbana", desc: "Mercado de Anton Martin, San Fernando o San Miguel exterior, Lavapies, comida, precios y vida cotidiana.", task: "Leer precios, comparar productos, describir ambientes y documentar interacciones." },
      { date: "6 June", city: "Madrid", title: "Rastro y autonomia urbana", desc: "Actividad dominical sobre comercio, cultura popular, segunda mano, vocabulario de objetos y precios.", task: "Quest con fotografias, palabras nuevas y pequenas interacciones." },
      { date: "7 June", city: "Madrid", title: "Madrid flexible: Reina Sofia, Retiro o proyectos", desc: "Jornada ajustable segun cansancio, presupuesto y disponibilidad. Posible foco en Guernica, memoria historica o recogida de materiales.", task: "Organizar evidencias para el informe multimodal." },
      { date: "8 June", city: "Madrid", title: "Cierre academico y preparacion de regreso", desc: "Discusion final, revision de tareas on site, organizacion de materiales y recordatorio de documentos.", task: "Confirmar recibos, boarding passes, notas y materiales del informe." },
      { date: "9 June", city: "Flight", title: "Salida de Madrid", desc: "Check-out, traslado al aeropuerto y vuelo internacional de regreso segun combinacion final de agencia.", task: "Conservar boarding passes y documentacion de reembolso." }
    ];

    const checklistGroups = [
      { title: "Agencias y reservas", items: ["Preparar solicitud homogenea para tres agencias", "Comparar precio, ubicacion, seguridad, cancelacion y experiencia con grupos", "Reservar Alhambra y Palacios Nazaries", "Reservar Prado", "Reservar Mezquita-Catedral", "Confirmar trenes Madrid-Granada-Cordoba-Madrid"] },
      { title: "Administracion", items: ["Confirmar modelo de pagos y reembolsos", "Confirmar deposito con School administrators", "Confirmar plazo y documentacion de claims", "Completar Overseas Travelling Application Form", "Preparar risk assessment"] },
      { title: "Estudiantes", items: ["Recoger contactos de emergencia", "Recoger alergias, medicacion y restricciones alimentarias", "Recoger datos y copia de pasaporte", "Confirmar telefono con datos moviles", "Preparar tarjeta de emergencia en papel"] },
      { title: "Curso", items: ["Disenar sesiones previas", "Preparar vocabulario B1.3", "Crear tareas tipo quest", "Asignar intervenciones individuales breves", "Definir instrucciones del informe multimodal"] }
    ];

    const cityCoords = {
      Madrid: [40.4168, -3.7038],
      Granada: [37.1773, -3.5986],
      Cordoba: [37.8882, -4.7794],
      Toledo: [39.8628, -4.0273],
      "Alcala de Henares": [40.48198, -3.36354]
    };

    const routeSegments = {
      "rail-mad-grx": { from: "Madrid", to: "Granada", type: "rail" },
      "rail-grx-cord": { from: "Granada", to: "Cordoba", type: "rail" },
      "rail-cord-mad": { from: "Cordoba", to: "Madrid", type: "rail" },
      "day-mad-tol": { from: "Madrid", to: "Toledo", type: "day" },
      "day-tol-mad": { from: "Toledo", to: "Madrid", type: "day" },
      "day-mad-alc": { from: "Madrid", to: "Alcala de Henares", type: "day" },
      "day-alc-mad": { from: "Alcala de Henares", to: "Madrid", type: "day" }
    };

    let currentStep = 0;
    let playing = false;
    let playTimer = null;
    let routeMap = null;
    let studentRouteMap = null;
    let routeLayerGroup = null;
    let animatedLine = null;
    let trainMarker = null;
    let animationFrame = null;
    const cityMarkers = {};

    const panels = document.querySelectorAll(".tab-panel");
    const tabButtons = document.querySelectorAll(".tab-button");
    const teacherNav = document.getElementById("teacherNav");
    const studentNav = document.getElementById("studentNav");

    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const target = button.dataset.tab;
        tabButtons.forEach((btn) => {
          btn.classList.toggle("active", btn === button);
          btn.setAttribute("aria-selected", btn === button ? "true" : "false");
        });
        panels.forEach((panel) => panel.classList.toggle("active", panel.id === target));
        teacherNav.hidden = target !== "teachers";
        studentNav.hidden = target !== "students";
        window.setTimeout(() => {
          if (routeMap) routeMap.invalidateSize();
          if (studentRouteMap) {
            studentRouteMap.invalidateSize();
            studentRouteMap.fitBounds(Object.values(cityCoords), { padding: [42, 42] });
          }
        }, 80);
      });
    });

    function renderMapCard(step) {
      const photo = photos[step.city] || photos.Madrid;
      document.getElementById("mapPhoto").src = photo.src;
      document.getElementById("mapPhoto").alt = photo.alt;
      document.getElementById("mapCity").textContent = step.city;
      document.getElementById("mapDate").textContent = step.date;
      document.getElementById("mapActivity").textContent = step.activity;
      document.getElementById("mapCredit").innerHTML = `<a href="${photo.href}" target="_blank" rel="noreferrer">${photo.credit}</a>`;
      document.getElementById("mapTags").innerHTML = step.tags.map((tag) => {
        const cls = tag.includes("Day") ? "tag daytrip" : tag.includes("Train") ? "tag" : "tag warn";
        return `<span class="${cls}">${tag}</span>`;
      }).join("");
    }

    function initLeafletMap() {
      const mapEl = document.getElementById("routeMap");
      if (!mapEl) return;

      if (!window.L) {
        mapEl.innerHTML = "<div class=\"notice\">Map library could not load. Check the internet connection and reload this page.</div>";
        return;
      }

      routeMap = L.map("routeMap", {
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: true
      }).setView([39.05, -4.05], 6);

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OSM</a> &copy; <a href=\"https://carto.com/attributions\">CARTO</a>",
        maxZoom: 19
      }).addTo(routeMap);

      routeLayerGroup = L.layerGroup().addTo(routeMap);

      Object.entries(cityCoords).forEach(([city, coords]) => {
        const photo = photos[city] || photos.Madrid;
        const marker = L.marker(coords, {
          icon: L.divIcon({
            className: "custom-map-marker",
            html: `<div class="marker-pin">${shortCityName(city)}</div>`,
            iconSize: [1, 1],
            iconAnchor: [18, 18]
          })
        }).addTo(routeMap);

        marker.bindPopup(`
          <div class="map-popup">
            <img src="${photo.src}" alt="${photo.alt}">
            <div class="map-popup-body">
              <p class="map-popup-title">${city}</p>
              <p class="map-popup-copy">${photo.title}</p>
            </div>
          </div>
        `);
        marker.on("click", () => {
          const stepIndex = mapSteps.findIndex((step) => step.city === city);
          if (stepIndex >= 0) updateMap(stepIndex);
        });
        cityMarkers[city] = marker;
      });

      trainMarker = L.marker(cityCoords.Madrid, {
        icon: L.divIcon({
          className: "train-map-marker",
          html: "<div class=\"train-marker\">AVE</div>",
          iconSize: [42, 30],
          iconAnchor: [21, 15]
        }),
        interactive: false,
        opacity: 0
      }).addTo(routeMap);

      routeMap.fitBounds(Object.values(cityCoords), { padding: [48, 48] });
    }

    function initStudentRouteMap() {
      const mapEl = document.getElementById("studentRouteMap");
      if (!mapEl || !window.L) return;

      studentRouteMap = L.map("studentRouteMap", {
        zoomControl: true,
        scrollWheelZoom: false,
        dragging: true,
        attributionControl: true
      }).setView([39.05, -4.05], 6);

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OSM</a> &copy; <a href=\"https://carto.com/attributions\">CARTO</a>",
        maxZoom: 19
      }).addTo(studentRouteMap);

      Object.values(routeSegments).forEach((segment) => {
        L.polyline([cityCoords[segment.from], cityCoords[segment.to]], segmentStyle(segment.type)).addTo(studentRouteMap);
      });

      Object.entries(cityCoords).forEach(([city, coords]) => {
        const photo = photos[city] || photos.Madrid;
        L.marker(coords, {
          icon: L.divIcon({
            className: "custom-map-marker",
            html: `<div class="marker-pin">${shortCityName(city)}</div>`,
            iconSize: [1, 1],
            iconAnchor: [18, 18]
          })
        }).addTo(studentRouteMap).bindPopup(`
          <div class="map-popup">
            <img src="${photo.src}" alt="${photo.alt}">
            <div class="map-popup-body">
              <p class="map-popup-title">${city}</p>
              <p class="map-popup-copy">${photo.title}</p>
            </div>
          </div>
        `);
      });

      studentRouteMap.fitBounds(Object.values(cityCoords), { padding: [42, 42] });
    }

    function shortCityName(city) {
      if (city === "Alcala de Henares") return "Alcala";
      return city;
    }

    function segmentLatLngs(segmentId) {
      const segment = routeSegments[segmentId];
      if (!segment) return [];
      return [cityCoords[segment.from], cityCoords[segment.to]];
    }

    function segmentStyle(type, muted = false) {
      const isRail = type === "rail";
      return {
        color: isRail ? "#d4622b" : "#f4c95d",
        weight: isRail ? 6 : 4,
        opacity: muted ? 0.26 : 0.95,
        dashArray: isRail ? null : "9 10",
        lineCap: "round",
        lineJoin: "round"
      };
    }

    function drawSegment(segmentId, muted = false) {
      if (!routeLayerGroup || !routeSegments[segmentId]) return null;
      const segment = routeSegments[segmentId];
      return L.polyline(segmentLatLngs(segmentId), segmentStyle(segment.type, muted)).addTo(routeLayerGroup);
    }

    function interpolate(a, b, progress) {
      return [
        a[0] + (b[0] - a[0]) * progress,
        a[1] + (b[1] - a[1]) * progress
      ];
    }

    function expandedRoute(pathIds) {
      const points = [];
      pathIds.filter(Boolean).forEach((id) => {
        const pair = segmentLatLngs(id);
        if (pair.length !== 2) return;
        if (!points.length) points.push(pair[0]);
        points.push(pair[1]);
      });
      return points;
    }

    function pointOnRoute(points, progress) {
      if (points.length <= 1) return points[0] || cityCoords.Madrid;
      const segments = points.length - 1;
      const scaled = Math.min(segments - 0.0001, Math.max(0, progress) * segments);
      const index = Math.floor(scaled);
      const local = scaled - index;
      return interpolate(points[index], points[index + 1], local);
    }

    function animateRoute(pathIds, type) {
      if (!routeLayerGroup || !routeMap) return;
      if (animationFrame) window.cancelAnimationFrame(animationFrame);

      const points = expandedRoute(pathIds);
      if (points.length < 2) return;
      const started = performance.now();
      const duration = type === "day" ? 1100 : 1350;
      animatedLine = L.polyline([points[0]], segmentStyle(type)).addTo(routeLayerGroup);

      if (trainMarker) {
        trainMarker.setOpacity(type === "rail" ? 1 : 0);
        trainMarker.setLatLng(points[0]);
      }

      function frame(now) {
        const progress = Math.min(1, (now - started) / duration);
        const currentPoint = pointOnRoute(points, progress);
        const visiblePoints = [];
        const segments = points.length - 1;
        const scaled = progress * segments;
        const wholeSegments = Math.floor(scaled);

        visiblePoints.push(points[0]);
        for (let i = 1; i <= wholeSegments && i < points.length; i += 1) {
          visiblePoints.push(points[i]);
        }
        visiblePoints.push(currentPoint);
        animatedLine.setLatLngs(visiblePoints);

        if (trainMarker && type === "rail") trainMarker.setLatLng(currentPoint);

        if (progress < 1) {
          animationFrame = window.requestAnimationFrame(frame);
        }
      }

      animationFrame = window.requestAnimationFrame(frame);
    }

    function drawRoutesThroughStep(showAll = false) {
      if (!routeLayerGroup || !routeMap) return;
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      routeLayerGroup.clearLayers();

      if (showAll) {
        mapSteps.forEach((item) => {
          if (item.path) drawSegment(item.path);
          if (item.returnPath) drawSegment(item.returnPath);
        });
        if (trainMarker) {
          trainMarker.setOpacity(1);
          trainMarker.setLatLng(cityCoords.Madrid);
        }
        routeMap.fitBounds(Object.values(cityCoords), { padding: [48, 48] });
        return;
      }

      mapSteps.forEach((step) => {
        if (step.path) drawSegment(step.path, true);
        if (step.returnPath) drawSegment(step.returnPath, true);
      });

      mapSteps.slice(0, currentStep).forEach((step) => {
        if (step.path) drawSegment(step.path);
        if (step.returnPath) drawSegment(step.returnPath);
      });

      const step = mapSteps[currentStep];
      if (step.path) {
        const type = routeSegments[step.path]?.type || "rail";
        animateRoute([step.path, step.returnPath], type);
      } else if (trainMarker) {
        trainMarker.setOpacity(0);
      }
    }

    function setActiveCity(city) {
      Object.entries(cityMarkers).forEach(([markerCity, marker]) => {
        const el = marker.getElement();
        if (el) el.classList.toggle("active", markerCity === city);
      });
    }

    function updateMap(index, showAll = false) {
      currentStep = (index + mapSteps.length) % mapSteps.length;
      const step = mapSteps[currentStep];
      renderMapCard(step);

      drawRoutesThroughStep(showAll);
      setActiveCity(step.city);
      if (!showAll && routeMap && cityCoords[step.city]) {
        routeMap.flyTo(cityCoords[step.city], step.city === "Granada" ? 7 : 8, {
          animate: true,
          duration: 0.8
        });
      }
      document.getElementById("citySelect").value = step.city;
    }

    function buildCitySelect() {
      const select = document.getElementById("citySelect");
      const cities = [...new Set(mapSteps.map((step) => step.city))];
      select.innerHTML = cities.map((city) => `<option value="${city}">${city}</option>`).join("");
      select.addEventListener("change", () => {
        const index = mapSteps.findIndex((step) => step.city === select.value);
        updateMap(index);
      });
    }

    function togglePlay() {
      playing = !playing;
      document.getElementById("playRoute").textContent = playing ? "Pause" : "Play";
      if (playing) {
        playTimer = window.setInterval(() => updateMap(currentStep + 1), 2200);
      } else {
        window.clearInterval(playTimer);
      }
    }

    function routeCardsMarkup() {
      const order = ["Madrid", "Granada", "Cordoba", "Toledo", "Alcala de Henares", "Letras"];
      return order.map((key) => {
        const photo = photos[key];
        return `
          <article class="route-card">
            <button type="button" class="image-open" data-src="${photo.src}" data-alt="${photo.alt}" data-caption="${photo.title} | ${photo.credit}">
              <img src="${photo.src}" alt="${photo.alt}">
            </button>
            <div class="body">
              <h3>${photo.title}</h3>
              <p class="credit"><a href="${photo.href}" target="_blank" rel="noreferrer">${photo.credit}</a></p>
            </div>
          </article>
        `;
      }).join("");
    }

    function renderRouteCards() {
      document.getElementById("routeCards").innerHTML = routeCardsMarkup();
      const studentCards = document.getElementById("studentRouteCards");
      if (studentCards) studentCards.innerHTML = routeCardsMarkup();
    }

    function renderDayFilters() {
      const cities = ["All", ...new Set(dayItems.map((item) => item.city.split(" / ")[0]))];
      const container = document.getElementById("dayFilters");
      container.innerHTML = cities.map((city, i) => `<button type="button" class="filter-button ${i === 0 ? "active" : ""}" data-city="${city}">${city}</button>`).join("");
      container.addEventListener("click", (event) => {
        const button = event.target.closest("button");
        if (!button) return;
        container.querySelectorAll("button").forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
        renderDayList(button.dataset.city);
      });
    }

    function renderDayList(filter = "All") {
      const filtered = filter === "All" ? dayItems : dayItems.filter((item) => item.city.includes(filter));
      document.getElementById("dayList").innerHTML = filtered.map((item, index) => `
        <details class="day-card" ${index < 2 ? "open" : ""}>
          <summary>
            <span class="day-date">${item.date}</span>
            <span class="day-title">${item.title}</span>
            <span class="day-city">${item.city}</span>
          </summary>
          <div class="day-content">
            <div>
              <p>${item.desc}</p>
              <div class="task-box"><strong>Tarea / recordatorio</strong>${item.task}</div>
            </div>
            <div class="panel">
              <h3>Notas docentes</h3>
              <ul>
                <li>Confirmar horario real cuando existan reservas.</li>
                <li>Mantener instrucciones breves, visuales y graduadas.</li>
                <li>Prever margen por calor, cansancio o retrasos.</li>
              </ul>
            </div>
          </div>
        </details>
      `).join("");
    }

    function renderStudentDays() {
      document.getElementById("studentDayList").innerHTML = dayItems.map((item, index) => `
        <details class="day-card" ${index < 3 ? "open" : ""}>
          <summary>
            <span class="day-date">${item.date}</span>
            <span class="day-title">${item.title}</span>
            <span class="day-city">${item.city}</span>
          </summary>
          <div class="day-content">
            <div>
              <p>${item.desc}</p>
              <div class="task-box"><strong>Enfoque del estudiante</strong>${item.task}</div>
            </div>
            <div class="panel">
              <h3>Recuerda</h3>
              <ul>
                <li>Llega puntual al punto de encuentro.</li>
                <li>Lleva agua, telefono y notas.</li>
                <li>Recoge material util para tu informe final.</li>
              </ul>
            </div>
          </div>
        </details>
      `).join("");
    }

    function updateChecklistProgress() {
      const checkboxes = document.querySelectorAll("#teacherChecklist [data-check-id]");
      const total = checkboxes.length;
      const done = Array.from(checkboxes).filter((cb) => cb.checked).length;
      const pct = total > 0 ? Math.round((done / total) * 100) : 0;
      const fill = document.getElementById("checklistProgressFill");
      const text = document.getElementById("checklistProgressText");
      if (fill) fill.style.width = pct + "%";
      if (text) text.textContent = `${done} / ${total} completados \u00b7 ${pct}%`;
    }

    function renderChecklist() {
      const saved = JSON.parse(localStorage.getItem("span2031-checklist") || "{}");
      document.getElementById("teacherChecklist").innerHTML = checklistGroups.map((group, groupIndex) => `
        <div class="check-group">
          <h3>${group.title}</h3>
          ${group.items.map((item, itemIndex) => {
            const id = `check-${groupIndex}-${itemIndex}`;
            return `
              <label class="check-item" for="${id}">
                <input type="checkbox" id="${id}" data-check-id="${id}" ${saved[id] ? "checked" : ""}>
                <span>${item}</span>
              </label>
            `;
          }).join("")}
        </div>
      `).join("");

      document.querySelectorAll("[data-check-id]").forEach((checkbox) => {
        checkbox.addEventListener("change", () => {
          const current = JSON.parse(localStorage.getItem("span2031-checklist") || "{}");
          current[checkbox.dataset.checkId] = checkbox.checked;
          localStorage.setItem("span2031-checklist", JSON.stringify(current));
          updateChecklistProgress();
        });
      });
      updateChecklistProgress();
    }

    function setupLightbox() {
      const dialog = document.getElementById("lightbox");
      const image = document.getElementById("lightboxImage");
      const caption = document.getElementById("lightboxCaption");
      document.addEventListener("click", (event) => {
        const button = event.target.closest(".image-open");
        if (!button) return;
        image.src = button.dataset.src;
        image.alt = button.dataset.alt;
        caption.textContent = button.dataset.caption;
        dialog.showModal();
      });
      document.querySelector(".lightbox-close").addEventListener("click", () => dialog.close());
      dialog.addEventListener("click", (event) => {
        if (event.target === dialog) dialog.close();
      });
    }

    document.getElementById("prevStep").addEventListener("click", () => updateMap(currentStep - 1));
    document.getElementById("nextStep").addEventListener("click", () => updateMap(currentStep + 1));
    document.getElementById("playRoute").addEventListener("click", togglePlay);
    document.getElementById("showFullRoute").addEventListener("click", () => updateMap(currentStep, true));
    window.addEventListener("beforeprint", () => {
      document.querySelectorAll(".tab-panel.active details").forEach((detail) => detail.setAttribute("open", ""));
    });

    function updateCountdown() {
      const departure = new Date("2027-05-26T00:00:00");
      const now = new Date();
      const diff = departure - now;
      const cdDays = document.getElementById("cdDays");
      const cdHours = document.getElementById("cdHours");
      const cdMins = document.getElementById("cdMins");
      if (!cdDays) return;
      if (diff <= 0) {
        cdDays.textContent = "0";
        cdHours.textContent = "00";
        cdMins.textContent = "00";
        return;
      }
      cdDays.textContent = Math.floor(diff / (1000 * 60 * 60 * 24));
      cdHours.textContent = String(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, "0");
      cdMins.textContent = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, "0");
    }

    function renderTimeline(containerId) {
      const container = document.getElementById(containerId);
      if (!container) return;
      const wrap = document.createElement("div");
      wrap.className = "timeline-wrap";
      const track = document.createElement("div");
      track.className = "timeline-track";
      track.innerHTML = dayItems.map((item) => {
        const rawCity = item.city.split(" / ")[0];
        const cc = "city-" + rawCity.replace(/\s/g, "-");
        return `<div class="tl-item ${cc}">
          <div class="tl-dot"></div>
          <div class="tl-card">
            <div class="tl-date">${item.date}</div>
            <div class="tl-title">${item.title}</div>
            <span class="tl-city-badge">${rawCity}</span>
          </div>
        </div>`;
      }).join("");
      wrap.appendChild(track);
      container.innerHTML = "";
      container.appendChild(wrap);
    }

    function initTimelineToggles() {
      document.querySelectorAll("[data-view-toggle]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const group = btn.dataset.viewGroup;
          const view = btn.dataset.view;
          document.querySelectorAll(`[data-view-group="${group}"]`).forEach((b) => b.classList.toggle("active", b === btn));
          document.querySelectorAll(`[data-view-panel="${group}"]`).forEach((panel) => {
            panel.hidden = panel.dataset.viewName !== view;
          });
        });
      });
    }

    function initFinanceTools() {
      const hkdInput  = document.getElementById("convHKD");
      const eurInput  = document.getElementById("convEUR");
      const rateInput = document.getElementById("convRate");

      function convertFromHKD() {
        const rate = parseFloat(rateInput?.value) || 1;
        const eur = parseFloat(hkdInput.value) / rate;
        if (eurInput) eurInput.value = (hkdInput.value === "" || isNaN(eur)) ? "" : eur.toFixed(2);
      }

      function convertFromEUR() {
        const rate = parseFloat(rateInput?.value) || 1;
        const hkd = parseFloat(eurInput.value) * rate;
        if (hkdInput) hkdInput.value = (eurInput.value === "" || isNaN(hkd)) ? "" : hkd.toFixed(0);
      }

      if (hkdInput) hkdInput.addEventListener("input", convertFromHKD);
      if (eurInput) eurInput.addEventListener("input", convertFromEUR);
      if (rateInput) rateInput.addEventListener("input", () => { if (hkdInput?.value) convertFromHKD(); });

      const budgetDays   = document.getElementById("budgetDays");
      const budgetEurDay = document.getElementById("budgetEurDay");
      const budgetExtra  = document.getElementById("budgetExtra");
      const budgetRate   = document.getElementById("budgetRate");
      const budgetResult = document.getElementById("budgetResult");

      function calcBudget() {
        const days  = parseFloat(budgetDays?.value)   || 0;
        const eur   = parseFloat(budgetEurDay?.value) || 0;
        const extra = parseFloat(budgetExtra?.value)  || 0;
        const rate  = parseFloat(budgetRate?.value)   || 1;
        const totalEur = days * eur + extra;
        const totalHKD = totalEur * rate;
        if (budgetResult) {
          budgetResult.innerHTML = `<span>${totalEur.toFixed(0)} EUR</span> &asymp; ${Math.round(totalHKD).toLocaleString()} HKD`;
        }
      }

      [budgetDays, budgetEurDay, budgetExtra, budgetRate].forEach((el) => { if (el) el.addEventListener("input", calcBudget); });
      calcBudget();
    }

    buildCitySelect();
    renderRouteCards();
    renderDayFilters();
    renderDayList();
    renderStudentDays();
    renderChecklist();
    setupLightbox();
    initLeafletMap();
    initStudentRouteMap();
    updateMap(0);
    updateCountdown();
    setInterval(updateCountdown, 30000);
    renderTimeline("teacherTimeline");
    renderTimeline("studentTimeline");
    initTimelineToggles();
    initFinanceTools();
