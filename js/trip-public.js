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
  contact: 'martinjg@hku.hk',
  coordinators: ['Pablo Torrado Solo de Zaldivar', 'Martín Juaristi'],
  verifiedOn: '4 November 2026',
  stages: [
    {id:'madrid',city:'Madrid',title:'A city to read',subtitle:'Art · identity · everyday life',description:'Explore how museums, public spaces and neighbourhoods tell different stories about Spain. Planned activities include the Prado, the historic centre and observation of urban life.',image:'assets/images/madrid-plaza-mayor.jpg',coords:[40.4168,-3.7038]},
    {id:'granada',city:'Granada',title:'Interpreting al-Andalus',subtitle:'Heritage · interpretation · tourism',description:'Study the Alhambra and Albaicín as places of layered history. Consider how heritage is explained, translated and experienced by different visitors.',image:'assets/images/granada-alhambra.jpg',coords:[37.1773,-3.5986]},
    {id:'cordoba',city:'Córdoba',title:'Layers of memory',subtitle:'Diversity · exchange · memory',description:'Read the Mezquita-Catedral and Judería through questions of religious diversity, cultural exchange and the interpretation of the past.',image:'assets/images/cordoba-mezquita.jpg',coords:[37.8882,-4.7794]},
    {id:'toledo',city:'Toledo',title:'Perspectives on coexistence',subtitle:'Day trip from Madrid',description:'Compare the ways religious buildings and urban spaces present the city’s layered histories. Examine how stories of coexistence are constructed for visitors.',image:'assets/images/toledo-panorama.jpg',coords:[39.8628,-4.0273]},
    {id:'alcala',city:'Alcalá de Henares',title:'Language and the university',subtitle:'Day trip from Madrid',description:'Connect Cervantes, language and university heritage through a planned visit to Alcalá de Henares. Exchanges with local institutions remain subject to confirmation.',image:'assets/images/alcala-university.jpg',coords:[40.4818,-3.3641]}
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
