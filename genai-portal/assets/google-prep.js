(function(){
  'use strict';
  var KEY='google-prep-v1';
  var state={tasks:{},track:'python',hours:'10'};
  try{state=Object.assign(state,JSON.parse(localStorage.getItem(KEY)||'{}'));}catch(e){}
  state.tasks=state.tasks||{};
  var boxes=[].slice.call(document.querySelectorAll('[data-task]'));
  var track=document.querySelector('[data-track]');
  var hours=document.querySelector('[data-hours]');
  var prompts={
    coding:[
      'Given a stream of integers, return the length of the longest contiguous subarray containing at most two distinct values. Explain the brute-force approach, optimize it, implement it in Python, and test edge cases.',
      'Design an algorithm to merge overlapping meeting intervals and then answer whether a new meeting can be inserted without conflict. State complexity and write production-quality Python.',
      'Given a directed graph of service dependencies, return a valid deployment order or report a cycle. Explain your representation and failure cases.'
    ],
    python:[
      'A FastAPI endpoint becomes slow under concurrent I/O. Diagnose likely causes, explain threads versus asyncio, and sketch a tested correction.',
      'Refactor a Python function that mixes validation, database access and business logic. Describe boundaries, error handling, typing and tests.',
      'Implement an in-memory TTL cache in Python. Discuss thread safety, eviction, testing and when not to build this yourself.'
    ],
    design:[
      'Design a distributed Python job-execution platform that accepts jobs, schedules workers, retries safely, reports progress and prevents duplicate execution.',
      'Design a file-processing service for large CSV uploads. Cover APIs, storage, queues, workers, idempotency, status tracking, failures and capacity.',
      'Design a metrics ingestion and alerting platform. Estimate load, choose storage, handle late events and explain reliability trade-offs.'
    ],
    behaviour:[
      'Tell me about a technically important decision where you changed your mind after receiving evidence from a colleague.',
      'Describe a time you operated in ambiguity. How did you create clarity without waiting for perfect requirements?',
      'Tell me about a failure you personally caused or failed to prevent. What changed in your engineering practice afterward?'
    ],
    scenario:[
      'A client demands a Friday launch, but testing shows intermittent data corruption. Product wants to proceed. Walk through your decision and communication.',
      'Two senior engineers disagree on architecture and the debate is blocking delivery. You are not their manager. What do you do?',
      'A production incident occurs while a junior engineer is primary on-call. Explain how you protect the system while preserving their ownership and learning.'
    ],
    resume:[
      'Choose the strongest Python/backend project on your resume. Precisely separate what you designed, coded, reviewed and merely observed. Then explain one hard trade-off.',
      'You report a major runtime improvement. Establish the baseline, measurement method, exact change, alternative explanations and production impact.',
      'Explain an API or data pipeline you worked on as if I am inheriting it tomorrow: contracts, dependencies, failure modes, tests, monitoring and unresolved debt.'
    ]
  };
  function save(){localStorage.setItem(KEY,JSON.stringify(state));}
  boxes.forEach(function(b){b.checked=!!state.tasks[b.dataset.task];b.addEventListener('change',function(){state.tasks[b.dataset.task]=b.checked;save();render();});});
  track.value=state.track||'python'; hours.value=state.hours||'10';
  track.addEventListener('change',function(){state.track=track.value;save();render();});
  hours.addEventListener('change',function(){state.hours=hours.value;save();renderWeek();});
  document.querySelector('[data-reset-progress]').addEventListener('click',function(){if(confirm('Reset all Google preparation progress?')){state.tasks={};boxes.forEach(function(b){b.checked=false;});save();render();}});
  document.querySelectorAll('[data-prompt]').forEach(function(btn){btn.addEventListener('click',function(){var type=btn.dataset.prompt;var list=prompts[type];var text=list[Math.floor(Math.random()*list.length)];var box=document.querySelector('[data-prompt-box]');box.hidden=false;box.querySelector('[data-prompt-type]').textContent=btn.closest('article').querySelector('h3').textContent;box.querySelector('[data-prompt-text]').textContent=text;box.scrollIntoView({behavior:'smooth',block:'center'});});});
  document.querySelector('[data-close-prompt]').addEventListener('click',function(){document.querySelector('[data-prompt-box]').hidden=true;});
  function render(){
    document.querySelectorAll('[data-track-panel]').forEach(function(p){p.hidden=p.dataset.trackPanel!==state.track;});
    document.querySelectorAll('[data-phase]').forEach(function(p){var bs=[].slice.call(p.querySelectorAll('[data-task]'));var done=bs.filter(function(b){return b.checked;}).length;var pct=Math.round(done/bs.length*100);p.querySelector('[data-phase-pct]').textContent=pct+'%';p.classList.toggle('complete',pct===100);});
    var done=boxes.filter(function(b){return b.checked;}).length;var score=Math.round(done/boxes.length*100);document.querySelector('[data-readiness-score]').textContent=score;document.querySelector('[data-score-ring]').style.setProperty('--score',score*3.6+'deg');
    var gates=['gate-ai-off','gate-medium','gate-project','gate-design','gate-stories','gate-mocks'];var gd=gates.filter(function(k){return state.tasks[k];}).length;var verdict=document.querySelector('[data-verdict]');
    if(gd===6) verdict.textContent='Application-ready signal: begin targeted applications and maintain mock-interview cadence.';
    else if(gd>=4) verdict.textContent='Mock-loop stage: close the remaining readiness gaps before broad applications.';
    else if(gd>=2) verdict.textContent='Skill-integration stage: combine DSA, project work and structured interview practice.';
    else verdict.textContent='Foundation stage: do not optimize for applications yet. Optimize for independent coding.';
    renderWeek();
  }
  function renderWeek(){
    var h=parseInt(state.hours||10,10);var plan=[];
    if(!state.tasks['py-api']) plan=[['Python without AI',Math.round(h*.4),'Implement, test and debug one small program or API.'],['DSA foundations',Math.round(h*.35),'Study one pattern and solve 3–4 problems.'],['Review',Math.max(1,Math.round(h*.15)),'Rebuild one solution from memory and record mistakes.'],['Resume evidence',Math.max(1,h-Math.round(h*.4)-Math.round(h*.35)-Math.max(1,Math.round(h*.15))),'Explain one real project aloud.']];
    else if(!state.tasks['dsa-100']) plan=[['Timed DSA',Math.round(h*.45),'Two focused sessions plus one timed problem.'],['Backend engineering',Math.round(h*.3),'Advance the production Python project.'],['Python drills',Math.max(1,Math.round(h*.15)),'Debug, refactor or test without AI.'],['Behavioural',Math.max(1,h-Math.round(h*.45)-Math.round(h*.3)-Math.max(1,Math.round(h*.15))),'Draft and rehearse one STAR story.']];
    else plan=[['Coding mocks',Math.round(h*.35),'Timed interview problems with verbal explanation.'],['System design',Math.round(h*.3),'One component lesson and one design.'],['Project depth',Math.round(h*.2),'Measure, test or harden your project.'],['Behavioural + resume',Math.max(1,h-Math.round(h*.35)-Math.round(h*.3)-Math.round(h*.2)),'Record two answers and critique them.']];
    document.querySelector('[data-week-plan]').innerHTML=plan.map(function(x){return '<article><b>'+x[1]+'h</b><div><h3>'+x[0]+'</h3><p>'+x[2]+'</p></div></article>';}).join('');
  }
  render();
})();
