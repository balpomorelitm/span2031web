/* Public information only. Planning estimates are not confirmed bookings. */
window.TRIP = Object.freeze({
  code: 'GLAS3112',
  title: 'Spain 2027',
  subtitle: 'Language, Heritage and Cultural Mediation',
  subclass: 'Subclass 2A',
  datesLabel: '26 May – 9 June 2027',
  startDate: '2027-05-26', endDate: '2027-06-09',
  groupLabel: '10–14 students',
  url: 'https://balpomorelitm.github.io/span2031web/estudiantes.html',
  contact: 'pablot@hku.hk,martinjg@hku.hk',
  coordinators: ['Pablo Torrado Solo de Zaldivar', 'Martín Juaristi'],
  verifiedOn: '4 November 2026',
  stages: [
    {id:'madrid',city:'Madrid',title:'A city to read',subtitle:'Art · identity · everyday life',description:'Explore how museums, public spaces and neighbourhoods tell different stories about Spain. Planned activities include the Prado, the historic centre and observation of urban life.',image:'assets/images/madrid-plaza-mayor.jpg',coords:[40.4168,-3.7038]},
    {id:'granada',city:'Granada',title:'Interpreting al-Andalus',subtitle:'Heritage · interpretation · tourism',description:'Study the Alhambra and Albaicín as places of layered history. Consider how heritage is explained, translated and experienced by different visitors.',image:'assets/images/granada-alhambra.jpg',coords:[37.1773,-3.5986]},
    {id:'cordoba',city:'Córdoba',title:'Layers of memory',subtitle:'Diversity · exchange · memory',description:'Read the Mezquita-Catedral and Judería through questions of religious diversity, cultural exchange and the interpretation of the past.',image:'assets/images/cordoba-mezquita.jpg',coords:[37.8882,-4.7794]},
    {id:'toledo',city:'Toledo',title:'Perspectives on coexistence',subtitle:'Day trip from Madrid',description:'Compare the ways religious buildings and urban spaces present the city’s layered histories. Examine how stories of coexistence are constructed for visitors.',image:'assets/images/toledo-panorama.jpg',coords:[39.8628,-4.0273]},
    {id:'alcala',city:'Alcalá de Henares',title:'Language and the university',subtitle:'Day trip from Madrid',description:'Connect Cervantes, language and university heritage through a planned visit to Alcalá de Henares. Exchanges with local institutions remain subject to confirmation.',image:'assets/images/alcala-university.jpg',coords:[40.4818,-3.3641]}
  ],
  languages: {
    title:'Learning en español and in English',
    main:'Previous knowledge of Spanish is not essential, but recommended.',
    note:'Academic work can be done in English.'
  },
  accommodation: {
    title:'Budget rooms for two to four students',
    description:'The current budget assumes shared rooms for 2–4 students and 14 nights in total. Final accommodation and night allocations remain subject to confirmation.',
    homestays:'We are also exploring homestays with local families in Madrid only. Availability, prices and meal arrangements are still to be confirmed.'
  },
  routeSteps: [
    {id:'madrid-arrival',cityId:'madrid',label:'Madrid · arrival',mode:'Arrival',title:'Arrival and orientation',description:'Settle into Madrid, meet the group and prepare for field observation through an orientation and safety briefing.',task:'Identify an example of how a public place communicates with different audiences.',route:['madrid']},
    {id:'granada',cityId:'granada',label:'Granada',mode:'Rail',title:'The Alhambra and Albaicín',description:'Travel south and explore architecture, landscape, heritage interpretation and the relationship between tourism and everyday life.',task:'Compare how a site presents its history in signs, displays or guided explanations.',route:['madrid','granada']},
    {id:'cordoba',cityId:'cordoba',label:'Córdoba',mode:'Rail',title:'Heritage, diversity and memory',description:'Explore the Mezquita-Catedral and the historic city through questions of cultural exchange, religious diversity and the interpretation of the past.',task:'Record evidence of the different historical layers visible in one place.',route:['granada','cordoba']},
    {id:'madrid-return',cityId:'madrid',label:'Madrid · return',mode:'Rail',title:'Museums, neighbourhoods and projects',description:'Return to the main base for museum visits, urban fieldwork and work on your interpretation project, including preparation for day trips.',task:'Connect a Spanish case with a regional or global question, including Hong Kong or Asia where relevant.',route:['cordoba','madrid']},
    {id:'alcala-day-trip',cityId:'alcala',label:'Alcalá de Henares · day trip',mode:'Day trip',title:'Cervantes, language and the university',description:'A planned return day trip from Madrid connects university heritage, language and cultural mediation. Any institutional exchange remains subject to confirmation.',task:'Consider how literary or university heritage is explained to international visitors.',route:['madrid','alcala','madrid']},
    {id:'toledo-day-trip',cityId:'toledo',label:'Toledo · day trip',mode:'Day trip',title:'Interpreting layered histories',description:'A planned return day trip from Madrid explores the city’s religious buildings and public spaces, and how different histories are presented to visitors.',task:'Compare two interpretations of coexistence, conflict or historical memory.',route:['madrid','toledo','madrid']}
  ],
  weather: [
    {cityId:'madrid',station:'Madrid Retiro',period:'1981–2010',source:'https://www.aemet.es/es/serviciosclimaticos/datosclimatologicos/valoresclimatologicos?l=3195',may:{max:22.2,min:11.3,rain:50},june:{max:28.2,min:16.1,rain:21}},
    {cityId:'granada',station:'Granada Airport',period:'1981–2010',source:'https://www.aemet.es/es/serviciosclimaticos/datosclimatologicos/valoresclimatologicos?l=5530E',may:{max:25.0,min:9.4,rain:28},june:{max:31.0,min:13.6,rain:11}},
    {cityId:'cordoba',station:'Córdoba Airport',period:'1981–2010',source:'https://www.aemet.es/es/serviciosclimaticos/datosclimatologicos/valoresclimatologicos?l=5402',may:{max:27.4,min:12.6,rain:40},june:{max:32.8,min:16.5,rain:13}},
    {cityId:'toledo',station:'Toledo',period:'1982–2010',source:'https://www.aemet.es/es/serviciosclimaticos/datosclimatologicos/valoresclimatologicos?l=3260B',may:{max:24.2,min:11.0,rain:44},june:{max:30.5,min:15.9,rain:24}},
    {cityId:'alcala',station:'Torrejón de Ardoz · nearby station used as a proxy for Alcalá',period:'1981–2010',source:'https://www.aemet.es/es/serviciosclimaticos/datosclimatologicos/valoresclimatologicos?l=3175',may:{max:23.2,min:9.6,rain:48},june:{max:29.6,min:14.1,rain:19}}
  ],
  emergency: [
    {number:'112',label:'General emergency',scope:'Spain-wide: urgent medical help, police or fire. Use this first in an emergency or if you are unsure which service you need.',url:'https://administracion.gob.es/tu-espacio-europeo/derechos-obligaciones/ciudadanos/asistencia-sanitaria/numeros-urgencia'},
    {number:'091',label:'Policía Nacional',scope:'National Police. For an immediate emergency, use 112.',url:'https://www.interior.gob.es/opencms/es/el-ministerio/directorio/servicios-centrales/direccion-general-de-la-policia/index.html'},
    {number:'092',label:'Local / municipal police',scope:'Local service; availability and remit depend on the municipality. Use 112 if unsure.',url:'https://www.diplomatie.gouv.fr/fr/information-par-pays/espagne/conseils-aux-voyageurs-contacts-utiles/'},
    {number:'062',label:'Guardia Civil',scope:'Guardia Civil emergency assistance, available 24 hours. Use 112 if unsure which service you need.',url:'https://web.guardiacivil.es/es/colaboracion/atencionciudadano_1/'},
    {number:'061',label:'Medical emergencies · Andalusia',scope:'Regional medical emergency service for Granada and Córdoba. For a general emergency anywhere on the route, use 112.',url:'https://www.juntadeandalucia.es/temas/salud/urgencias/urgencias.html'},
    {number:'080',label:'Fire service · Córdoba city',scope:'Local fire service in Córdoba city. For fire emergencies in Madrid, Toledo or Alcalá, or if unsure, use 112.',url:'https://www.cordoba.es/servicios/seguridad-y-via-publica/la-delegacion/localizacion-y-contacto'}
  ],
  assessment: [
    {label:'Preparatory research briefing',weight:15},
    {label:'Fieldwork portfolio',weight:25},
    {label:'Team presentation or cultural-mediation project',weight:20},
    {label:'Individual analytical report',weight:25},
    {label:'Participation and professional conduct',weight:15}
  ],
  budget: {
    rate:9, subtotalEUR:1708, contingencyEUR:170.8, totalEUR:1878.8, totalHKD:16909.2,
    items:[
      {label:'Return flight: Hong Kong–Madrid',eur:700},
      {label:'Shared accommodation · 14 nights',eur:405},
      {label:'Breakfasts · 15 × €4',eur:60},
      {label:'Lunches · 15 × €8',eur:120},
      {label:'Dinners · 15 × €10',eur:150},
      {label:'Madrid–Granada–Córdoba–Madrid transport',eur:75},
      {label:'Toledo and Alcalá day-trip transport',eur:23},
      {label:'Local and airport transport',eur:50},
      {label:'Museums, heritage sites and academic visits',eur:110},
      {label:'Materials and administration · provisional',eur:15}
    ],
    fgef:{maximumHKD:12000,advanceDays:28,url:'https://arts.hku.hk/current-students/career-development/enhancing-student-employability-with-hkuarts-financial-support/'}
  }
});
