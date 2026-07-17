/* =========================================================================
   GenAI Learning Hub — Unified site navigation (Option C)
   ONE sidebar shared by every page across all folders. Content stays grouped
   and visually distinct by source folder; nothing is flattened into a single
   mixed list. No iframes — every link is a normal navigation.

   This module owns the sidebar (.nav) and the cross-site search box. It builds
   from a single central registry of GROUPS → pages, each page carrying a
   canonical path relative to the SITE ROOT (the folder that contains
   genai-portal/, learn-rag-mcp/ and teach-agents/). At run time it detects how
   deep the current page sits and rewrites every href with the right number of
   "../" hops, so the same registry works from any folder.

   The page's existing controller (app.js or portal-page.js) still handles
   theme, right-rail TOC, copy buttons, quizzes and the mobile drawer — they
   just no longer build the sidebar (this does).
   Pure vanilla JS, no deps, offline-safe.
   ========================================================================= */
(function () {
  "use strict";

  /* ---------- Central registry (paths are relative to the SITE ROOT) ---------- */
  var GROUPS = [
    {
      id: "start", label: "Start Here", mark: "0", blurb: "Roadmap, order and study cadence", home: "genai-portal/index.html",
      pages: [
        { path: "genai-portal/index.html", title: "Zero-to-Interview Roadmap", num: "00", kw: "home start beginner zero roadmap sequence interview ready" },
        { path: "genai-portal/study-plan.html", title: "Global Study Plan", num: "01", kw: "study plan roadmap hours schedule weekly cadence route" }
      ]
    },
    {
      id: "prerequisites", label: "Stage 00 · Prerequisites", mark: "P", blurb: "Python, APIs and backend basics", home: "genai-portal/google-prep/index.html",
      pages: [
        { path: "genai-portal/google-prep/index.html", title: "Python & Engineering Preparation", num: "P0", kw: "python fundamentals git api json dsa backend preparation beginner" },
        { path: "genai-portal/interview-labs/index.html", title: "Focused Labs Overview", num: "P1", kw: "focused coding labs python backend fastapi websocket overview" },
        { path: "genai-portal/interview-labs/python-sync-async-interview.html", title: "Sync vs Async Python", num: "P2", kw: "python synchronous asynchronous asyncio event loop coroutine task thread process gil" },
        { path: "genai-portal/interview-labs/fastapi-interview.html", title: "FastAPI Foundations", num: "P3", kw: "fastapi asgi pydantic dependency injection request lifecycle testing security" },
        { path: "genai-portal/interview-labs/websockets-interview.html", title: "WebSockets", num: "P4", kw: "websocket handshake frames realtime heartbeat reconnect backpressure scaling" }
      ]
    },
    {
      id: "foundations", label: "Stage 01 · AI & LLM Foundations", mark: "1", blurb: "Neural networks through prompting", home: "genai-portal/interview-prep/00-neural-networks.html",
      pages: [
        { path: "genai-portal/interview-prep/00-neural-networks.html", title: "Neural Networks for AI Engineers", num: "1.1", kw: "neural network neuron weights bias activation forward loss backpropagation optimizer gradients pytorch" },
        { path: "genai-portal/modules/01_foundations.html", title: "Foundations of LLMs", num: "1.2", kw: "llm tokens context next token prediction decoding temperature prompt" },
        { path: "genai-portal/modules/02_transformers.html", title: "Transformers Deep Dive", num: "1.3", kw: "transformer attention qkv multi head positional encoding masking residual layernorm" },
        { path: "genai-portal/memory.html", title: "Memory & Context in LLMs", num: "1.4", kw: "memory context window stateless chat history" },
        { path: "genai-portal/interview-prep/01-llm-foundations-prompting.html", title: "Prompting & Structured Output", num: "1.5", kw: "prompting structured output function calling hallucination fine tuning" },
        { path: "genai-portal/modules/03_local_llms.html", title: "Local LLMs & Ollama", num: "1.6", kw: "ollama local llama qwen gemma quantization gguf gpu vram" },
        { path: "learn-rag-mcp/01-llms.html", title: "LLMs — Hands-on Foundation", num: "1.7", kw: "llm foundation hands on token context hallucination temperature" },
        { path: "genai-portal/hermes.html", title: "Hermes & Open Local Models", num: "1.8", track: "Optional deep dive", kw: "hermes nous ollama open function calling local models" }
      ]
    },
    {
      id: "retrieval", label: "Stage 02 · Embeddings & RAG", mark: "2", blurb: "Retrieve, ground, evaluate and debug", home: "genai-portal/modules/04_embeddings.html",
      pages: [
        { path: "genai-portal/modules/04_embeddings.html", title: "Embeddings", num: "2.1", kw: "embedding vector cosine similarity semantic dense sparse" },
        { path: "genai-portal/modules/05_vector_databases.html", title: "Vector Databases", num: "2.2", kw: "vector database faiss qdrant pgvector hnsw ann index recall" },
        { path: "genai-portal/modules/06_rag_basics.html", title: "RAG Basics", num: "2.3", kw: "rag retrieval augmented generation chunking grounding citations" },
        { path: "learn-rag-mcp/02-rag.html", title: "RAG — Hands-on Guide", num: "2.4", kw: "rag guide retrieval embedding chunk vector grounding" },
        { path: "learn-rag-mcp/05-build-simple-rag.html", title: "Build a Simple RAG App", num: "2.5", kw: "build simple rag project embeddings" },
        { path: "learn-rag-mcp/06-build-pdf-qna.html", title: "Build PDF Q&A", num: "2.6", kw: "pdf qna question answering rag chunk" },
        { path: "genai-portal/modules/07_advanced_rag.html", title: "Advanced RAG", num: "2.7", kw: "hybrid search reranking query expansion parent document graph rag context compression" },
        { path: "genai-portal/rag-deep-dive.html", title: "RAG End-to-End", num: "2.8", kw: "rag pipeline chunking reranking retrieval evaluation debugging end to end" },
        { path: "genai-portal/interview-prep/02-embeddings-rag.html", title: "Embeddings & RAG Interview Questions", num: "2.9", track: "Interview check", kw: "embeddings cosine vector database chunking hybrid reranking retrieval evaluation" },
        { path: "genai-portal/interview-labs/rag-interview.html", title: "Timed RAG Interview Lab", num: "2.10", track: "Interview check", kw: "rag interview lab retrieval security system design debugging" }
      ]
    },
    {
      id: "agents", label: "Stage 03 · Agents, Tools & MCP", mark: "3", blurb: "Agent loops, state and orchestration", home: "genai-portal/modules/08_agents.html",
      pages: [
        { path: "genai-portal/modules/08_agents.html", title: "Agentic AI", num: "3.1", kw: "agent react tool calling planning reflection memory loop" },
        { path: "teach-agents/index.html", title: "Understanding AI Agents — Course", num: "3.2", kw: "agents course overview start" },
        { path: "teach-agents/lessons/0001-what-is-an-agent.html", title: "What Is an Agent?", num: "3.3", track: "Agent literacy course", kw: "agent definition loop tools chatbot" },
        { path: "teach-agents/lessons/0002-run-your-first-agent.html", title: "Run Your First Agent", num: "3.4", track: "Agent literacy course", kw: "run agent python hands on first" },
        { path: "teach-agents/lessons/0003-prediction-vs-threshold.html", title: "Prediction vs Threshold", num: "3.5", track: "Agent literacy course", kw: "prediction threshold forecast anomaly" },
        { path: "teach-agents/lessons/0004-orchestration.html", title: "Orchestration", num: "3.6", track: "Agent literacy course", kw: "orchestration chain multi agent" },
        { path: "teach-agents/lessons/0005-workflow-vs-agent.html", title: "Workflow vs Agent", num: "3.7", track: "Agent literacy course", kw: "workflow autonomous agent decide" },
        { path: "teach-agents/lessons/0006-mapping-any-enm-row.html", title: "Mapping Any EnM Row", num: "3.8", track: "Agent literacy course", kw: "mapping enm row decompose method" },
        { path: "teach-agents/reference/agent-glossary.html", title: "Agent Glossary", num: "3.9", track: "Agent literacy course", kw: "agent glossary reference terms" },
        { path: "genai-portal/modules/09_mcp.html", title: "Model Context Protocol", num: "3.10", kw: "mcp model context protocol server client tools resources prompts" },
        { path: "learn-rag-mcp/03-agents.html", title: "Agents & Tool Use — Guide", num: "3.11", kw: "agent tool loop react planning function calling" },
        { path: "learn-rag-mcp/04-mcp.html", title: "MCP — Hands-on Guide", num: "3.12", kw: "mcp protocol host client server tools resources" },
        { path: "genai-portal/modules/10_langchain.html", title: "LangChain", num: "3.13", kw: "langchain lcel chains runnable retriever memory tools" },
        { path: "genai-portal/interview-labs/langchain-interview.html", title: "LangChain Interview Lab", num: "3.14", kw: "langchain agent tools middleware structured output streaming testing" },
        { path: "genai-portal/modules/12_langgraph.html", title: "LangGraph", num: "3.15", kw: "langgraph state node edge conditional routing checkpoint human in loop" },
        { path: "genai-portal/langgraph.html", title: "LangGraph Components Deep Dive", num: "3.16", kw: "langgraph state node edge checkpointer components" },
        { path: "genai-portal/langgraph-asyncio.html", title: "AsyncIO for LangGraph", num: "3.17", kw: "asyncio event loop coroutine taskgroup cancellation timeout semaphore backpressure" },
        { path: "genai-portal/langgraph-pydantic.html", title: "Pydantic for LangGraph", num: "3.18", kw: "pydantic basemodel validator strict schema union state" },
        { path: "genai-portal/modules/11_llamaindex.html", title: "LlamaIndex", num: "3.19", kw: "llamaindex index node document query engine retriever" },
        { path: "genai-portal/modules/13_multi_agents.html", title: "Multi-Agent Systems", num: "3.20", kw: "multi agent orchestration supervisor handoff shared state" },
        { path: "genai-portal/interview-prep/03-agents-mcp.html", title: "Agents, LangGraph & MCP Questions", num: "3.21", track: "Interview check", kw: "agents workflows react tool calling langgraph mcp memory multi agent" },
        { path: "genai-portal/interview-labs/mcp-interview.html", title: "MCP Interview Lab", num: "3.22", track: "Interview check", kw: "mcp host client server transport security interview" },
        { path: "genai-portal/claude-agent.html", title: "How a Claude Agent Works", num: "3.23", track: "Optional deep dive", kw: "claude agent sdk tool runner loop context safety" }
      ]
    },
    {
      id: "production", label: "Stage 04 · Production Engineering", mark: "4", blurb: "Evaluation, security, scale and data", home: "genai-portal/modules/14_production_genai.html",
      pages: [
        { path: "genai-portal/modules/14_production_genai.html", title: "Production GenAI", num: "4.1", kw: "production observability tracing cost guardrails rate limiting evaluation testing security" },
        { path: "genai-portal/interview-prep/04-evaluation-llmops.html", title: "Evaluation & LLMOps", num: "4.2", kw: "evaluation golden dataset llm judge tracing prompt version drift release gate" },
        { path: "genai-portal/langfuse.html", title: "Langfuse Observability", num: "4.3", kw: "langfuse observability trace cost latency quality scores" },
        { path: "genai-portal/interview-prep/05-production-performance.html", title: "Production, Latency & Cost", num: "4.4", kw: "model selection latency streaming caching concurrency batching cost backpressure slo" },
        { path: "genai-portal/guardrails.html", title: "Guardrails", num: "4.5", kw: "guardrails safety scope pii hallucination policy" },
        { path: "genai-portal/interview-prep/06-security-responsible-ai.html", title: "Security & Responsible AI", num: "4.6", kw: "prompt injection rbac pii secrets responsible ai bias defense" },
        { path: "genai-portal/interview-prep/07-python-backend-cloud.html", title: "Python, Backend & Cloud", num: "4.7", kw: "python async fastapi pydantic queues idempotency tenancy docker kubernetes testing" },
        { path: "genai-portal/interview-prep/09-sql-for-genai.html", title: "SQL & Data Systems for GenAI", num: "4.8", kw: "sql joins windows cte indexing explain transactions postgres jsonb pgvector tenant text to sql" }
      ]
    },
    {
      id: "projects", label: "Stage 05 · Build a Defensible Project", mark: "5", blurb: "Implement, evaluate and document", home: "genai-portal/modules/15_capstone_projects.html",
      pages: [
        { path: "genai-portal/modules/15_capstone_projects.html", title: "Capstone Projects", num: "5.1", kw: "capstone project rag sql agent mcp multi agent enterprise" },
        { path: "learn-rag-mcp/index.html", title: "Hands-on RAG · MCP · Agents Guide", num: "5.2", kw: "hands on rag mcp agents llms build guide" },
        { path: "learn-rag-mcp/07-eda-agent-ollama.html", title: "Build an EDA Agent with Ollama", num: "5.3", kw: "eda agent ollama local pandas analysis project" },
        { path: "genai-portal/ats-agent-lab/index.html", title: "ATS Agent Build Lab", num: "5.4", kw: "ats recruitment agent lab production project six agents" },
        { path: "genai-portal/ats-agent-lab/01-system-map.html", title: "ATS System Map & Stack", num: "5.5", track: "ATS project path", kw: "architecture layers fastapi pydantic postgres react" },
        { path: "genai-portal/ats-agent-lab/02-shared-client.html", title: "Shared LLM Client", num: "5.6", track: "ATS project path", kw: "anthropic client json pydantic retry timeout tracing" },
        { path: "genai-portal/ats-agent-lab/03-recruitment-agents.html", title: "Recruitment Agents", num: "5.7", track: "ATS project path", kw: "jd resume screening candidate matching evidence" },
        { path: "genai-portal/ats-agent-lab/04-interview-agents.html", title: "Interview Agents", num: "5.8", track: "ATS project path", kw: "interview scheduling questions feedback agents" },
        { path: "genai-portal/ats-agent-lab/05-production-safety.html", title: "Production Safety", num: "5.9", track: "ATS project path", kw: "safety guardrails validation security human approval" },
        { path: "genai-portal/ats-agent-lab/06-optimization-evals.html", title: "Optimization & Evaluations", num: "5.10", track: "ATS project path", kw: "optimization evaluation llmops testing metrics" },
        { path: "genai-portal/ats-agent-lab/07-build-from-scratch.html", title: "Build from Scratch", num: "5.11", track: "ATS project path", kw: "python fastapi tutorial capstone build service code" }
      ]
    },
    {
      id: "interview", label: "Stage 06 · Interview Performance", mark: "6", blurb: "Questions, mocks and system design", home: "genai-portal/interview-prep/index.html",
      pages: [
        { path: "genai-portal/interview-prep/index.html", title: "GenAI Question Bank Overview", num: "6.1", kw: "interview questions genai preparation answers overview" },
        { path: "genai-portal/interview-prep/08-project-behavioral.html", title: "Project & Behavioural Questions", num: "6.2", kw: "project architecture failure optimization tradeoff stakeholder ownership behavioral" },
        { path: "genai-portal/interview-hub/index.html", title: "Complete GenAI Interview Hub", num: "6.3", kw: "complete interview hub questions projects system design mocks revision" },
        { path: "genai-portal/scenario-practice/index.html", title: "Scenario Design Studio", num: "6.4", kw: "system design scenario practice genai architecture" },
        { path: "genai-portal/scenario-practice/framework.html", title: "Scenario Answer Framework", num: "6.5", track: "System design cases", kw: "clarify design scale secure measure framework" },
        { path: "genai-portal/scenario-practice/01-enterprise-knowledge-assistant.html", title: "Enterprise Knowledge Assistant", num: "6.6", track: "System design cases", kw: "enterprise rag permissions citations hybrid retrieval latency" },
        { path: "genai-portal/scenario-practice/02-customer-support-agent.html", title: "Customer Support Agent", num: "6.7", track: "System design cases", kw: "customer support agent tools workflow handoff pii latency" },
        { path: "genai-portal/scenario-practice/03-secure-text-to-sql.html", title: "Secure Text-to-SQL", num: "6.8", track: "System design cases", kw: "text to sql semantic layer read only ast injection rbac" },
        { path: "genai-portal/scenario-practice/04-ats-recruiter-copilot.html", title: "ATS Recruiter Copilot", num: "6.9", track: "System design cases", kw: "ats recruiter resume screening bias audit human review" },
        { path: "genai-portal/scenario-practice/05-multilingual-voice-assistant.html", title: "Multilingual Voice Assistant", num: "6.10", track: "System design cases", kw: "voice speech streaming multilingual latency barge in" },
        { path: "genai-portal/scenario-practice/06-invoice-document-workflow.html", title: "Invoice Document Workflow", num: "6.11", track: "System design cases", kw: "invoice document ocr extraction validation workflow queue" },
        { path: "genai-portal/scenario-practice/07-high-scale-shopping-assistant.html", title: "High-scale Shopping Assistant", num: "6.12", track: "System design cases", kw: "shopping recommendations catalog search high scale cache" },
        { path: "genai-portal/scenario-practice/08-regulated-financial-research.html", title: "Regulated Financial Research", num: "6.13", track: "System design cases", kw: "financial research compliance citations audit secure rag" }
      ]
    }
  ];

  /* ---------- Locate this page within the registry & compute depth ---------- */
  // Normalise the current path to a site-root-relative form by matching the
  // tail against known registry paths. We compare by the last 1-3 segments.
  var loc = location.pathname.replace(/\\/g, "/");
  var here = loc.substring(loc.lastIndexOf("/") + 1) || "index.html";
  // segments after the site root are unknown, so identify the current page by
  // matching folder + file against registry entries.
  var folder = (function () {
    var parts = loc.split("/").filter(Boolean);
    return parts.length >= 2 ? parts[parts.length - 2] : "";
  })();

  function isCurrent(pagePath) {
    var segs = pagePath.split("/");
    var file = segs[segs.length - 1];
    var dir = segs.length >= 2 ? segs[segs.length - 2] : "";
    if (file !== here) return false;
    // disambiguate index.html (exists in 3 folders) by the parent folder
    if (file === "index.html") return dir === folder;
    return true;
  }

  // How many "../" to reach the site root from the current page.
  // Depth = number of path segments below the site root - 1 (for the file).
  // We can't know the absolute root, so derive it from the matched current page.
  var current = null, currentGroup = null;
  GROUPS.forEach(function (g) {
    g.pages.forEach(function (p) { if (isCurrent(p.path)) { current = p; currentGroup = g; } });
  });
  // Fallback: if not found (new/unknown page), assume genai-portal/ depth.
  var currentPathFromRoot = current ? current.path : (folder ? folder + "/" + here : here);
  var depth = currentPathFromRoot.split("/").length - 1;   // dirs above the file
  var UP = depth > 0 ? new Array(depth + 1).join("../") : "";

  function href(pagePath) { return UP + pagePath; }

  /* ---------- Build the grouped sidebar ---------- */
  function trackChunks(pages) {
    // group a section's pages by their optional `track`, preserving order
    var out = [], seen = {};
    pages.forEach(function (p) {
      var t = p.track || "";
      if (!seen[t]) { seen[t] = { track: t, items: [] }; out.push(seen[t]); }
      seen[t].items.push(p);
    });
    return out;
  }

  function buildSidebar() {
    var nav = document.querySelector(".nav");
    if (!nav) return;
    var html = "";
    GROUPS.forEach(function (g) {
      var open = (g === currentGroup);
      if (g.direct) {
        html += '<div class="navgroup navgroup-direct' + (open ? " open" : "") + '" data-group="' + g.id + '">' +
                '<a class="navgroup-head" href="' + href(g.pages[0].path) + '">' +
                '<span class="ng-mk">' + g.mark + '</span>' +
                '<span class="ng-copy"><span class="ng-label">' + g.label + '</span><span class="ng-blurb">' + g.blurb + '</span></span>' +
                '<span class="ng-direct-arrow" aria-hidden="true">→</span></a></div>';
        return;
      }
      html += '<div class="navgroup' + (open ? " open" : "") + '" data-group="' + g.id + '">';
      html += '<button class="navgroup-head" aria-expanded="' + (open ? "true" : "false") + '">' +
                '<span class="ng-mk">' + g.mark + '</span>' +
                '<span class="ng-copy"><span class="ng-label">' + g.label + '</span><span class="ng-blurb">' + g.blurb + '</span></span>' +
                '<svg class="ng-chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>' +
                '</button>';
      html += '<div class="navgroup-body">';
      trackChunks(g.pages).forEach(function (chunk) {
        if (chunk.track) html += '<div class="nav-track">' + chunk.track + '</div>';
        chunk.items.forEach(function (p) {
          var active = isCurrent(p.path) ? " active" : "";
          html += '<a class="nav-item' + active + '" href="' + href(p.path) + '">' +
                  '<span class="num">' + p.num + '</span><span class="nt">' + p.title + '</span></a>';
        });
      });
      html += '</div></div>';
    });
    nav.innerHTML = html;
    nav.classList.add("sitenav");

    // collapse/expand
    nav.querySelectorAll(".navgroup:not(.navgroup-direct) > .navgroup-head").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var grp = btn.closest(".navgroup");
        var nowOpen = grp.classList.toggle("open");
        btn.setAttribute("aria-expanded", nowOpen ? "true" : "false");
      });
    });

    // close mobile drawer when a link is chosen (app.js/portal-page.js read .app.nav-open)
    var app = document.querySelector(".app");
    if (app) nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { app.classList.remove("nav-open"); });
    });
  }



  /* ---------- Keep every page's previous/next controls on the same sequence ---------- */
  function syncSequentialPageNav() {
    if (!current) return;
    var sequence = [];
    GROUPS.forEach(function (g) {
      g.pages.forEach(function (p) { sequence.push({ page: p, group: g }); });
    });
    var idx = sequence.findIndex(function (rec) { return rec.page === current; });
    if (idx < 0) return;
    var nav = document.querySelector(".page-nav");
    if (!nav) {
      var content = document.querySelector(".content");
      if (!content) return;
      nav = document.createElement("div");
      nav.className = "page-nav";
      content.appendChild(nav);
    }
    function link(rec, cls, direction) {
      if (!rec) return '<span class="sequence-nav-empty" aria-hidden="true"></span>';
      return '<a class="' + cls + '" href="' + href(rec.page.path) + '">' +
        '<div class="dir">' + direction + ' · ' + rec.group.label + '</div>' +
        '<div class="ttl">' + rec.page.title + '</div></a>';
    }
    nav.setAttribute("aria-label", "Sequential learning navigation");
    nav.innerHTML = link(sequence[idx - 1], "prev", "← Previous") +
                    link(sequence[idx + 1], "next", "Next →");
  }

  /* ---------- Mobile drawer chrome ---------- */
  function buildMobileDrawerChrome() {
    var sidebar = document.querySelector(".sidebar");
    var brand = sidebar && sidebar.querySelector(".brand");
    if (!sidebar || !brand || sidebar.querySelector(".mobile-nav-intro")) return;

    var close = document.createElement("button");
    close.className = "mobile-nav-close";
    close.type = "button";
    close.setAttribute("aria-label", "Close navigation");
    close.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    brand.appendChild(close);

    var intro = document.createElement("section");
    intro.className = "mobile-nav-intro";
    var currentLabel = currentGroup ? currentGroup.label : "GenAI Learning Hub";
    var currentCount = currentGroup ? currentGroup.pages.length : GROUPS.length;
    var countLabel = currentGroup ? (currentCount + (currentCount === 1 ? " page" : " pages") + " in this path") : (currentCount + " learning paths");
    intro.innerHTML =
      '<span class="mobile-nav-eyebrow"><i></i> Learning workspace</span>' +
      '<strong>' + currentLabel + '</strong>' +
      '<p>Jump between focused lessons, labs and interview practice without losing your place.</p>' +
      '<div class="mobile-nav-meta"><span>' + countLabel + '</span><span>Search ready</span></div>';
    brand.insertAdjacentElement("afterend", intro);
  }

  /* ---------- Cross-site search (searches ALL groups) ---------- */
  function setupSearch() {
    var input = document.querySelector("[data-search]") || document.querySelector("[data-secsearch]");
    var out = document.querySelector(".search-results") || document.querySelector("[data-secresults]");
    if (!input || !out) return;
    // flatten registry for searching, remembering each page's group label
    var index = [];
    GROUPS.forEach(function (g) {
      g.pages.forEach(function (p) { index.push({ p: p, group: g.label }); });
    });
    function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
    function render(q) {
      q = q.trim().toLowerCase();
      if (!q) { out.innerHTML = ""; return; }
      var hits = index.map(function (rec) {
        var hay = (rec.p.title + " " + rec.group + " " + (rec.p.kw || "")).toLowerCase();
        var score = 0;
        if (rec.p.title.toLowerCase().indexOf(q) > -1) score += 10;
        q.split(/\s+/).forEach(function (w) { if (w && hay.indexOf(w) > -1) score += 1; });
        return { rec: rec, score: score };
      }).filter(function (x) { return x.score > 0; })
        .sort(function (a, b) { return b.score - a.score; }).slice(0, 8);
      if (!hits.length) { out.innerHTML = '<div class="search-empty">No results for "' + q + '"</div>'; return; }
      out.innerHTML = hits.map(function (h) {
        var p = h.rec.p;
        var t = p.title.replace(new RegExp("(" + esc(q) + ")", "i"), "<b>$1</b>");
        return '<a class="search-result" href="' + href(p.path) + '">' +
               '<span class="sr-group">' + h.rec.group + '</span>' + t + "</a>";
      }).join("");
    }
    input.addEventListener("input", function (e) { render(e.target.value); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "/" && document.activeElement !== input && !/input|textarea/i.test(document.activeElement.tagName)) {
        e.preventDefault(); input.focus();
      }
      if (e.key === "Escape") { input.blur(); out.innerHTML = ""; }
    });
  }

  /* ---------- Brand link → this section's home (or hub root) ---------- */
  function fixBrand() {
    var brandLink = document.querySelector(".brand a, a.brand");
    if (brandLink) brandLink.setAttribute("href", href("genai-portal/index.html"));
  }

  /* ---------- Footer credit (subtle, on every page) ---------- */
  function injectFooter() {
    var content = document.querySelector(".content");
    if (!content || content.querySelector(".site-footer")) return;
    var year = new Date().getFullYear();
    var f = document.createElement("footer");
    f.className = "site-footer";
    f.innerHTML =
      '<span>© ' + year + ' GenAI Learning Hub</span>' +
      '<span class="sep">·</span>' +
      '<span>Developed by Deepankar Kotnala</span>';
    content.appendChild(f);
  }

  /* ---------- ☰ button: collapse the sidebar on desktop, open the drawer on
     mobile. The desktop collapse choice is remembered across pages/visits. ---- */
  var LS_SIDEBAR = "gp.sidebar";        // "collapsed" | "open"
  var MOBILE_BP = 860;                  // matches the CSS breakpoint

  function isMobile() { return window.matchMedia("(max-width: " + MOBILE_BP + "px)").matches; }

  function setupSidebarToggle() {
    var app = document.querySelector(".app");
    var menu = document.querySelector(".menu-btn");
    var sidebar = document.querySelector(".sidebar");
    var backdrop = document.querySelector(".backdrop");
    var close = document.querySelector(".mobile-nav-close");
    if (!app) return;

    function setMobileDrawer(open, restoreFocus) {
      open = Boolean(open && isMobile());
      app.classList.toggle("nav-open", open);
      document.body.classList.toggle("nav-drawer-open", open);
      if (menu) menu.setAttribute("aria-expanded", open ? "true" : "false");
      if (sidebar) {
        var hidden = !open && isMobile();
        sidebar.setAttribute("aria-hidden", hidden ? "true" : "false");
        sidebar.inert = hidden;
      }
      if (!open && restoreFocus && menu) menu.focus();
    }

    // Restore the saved desktop state (only affects desktop; mobile uses the drawer).
    try {
      if (localStorage.getItem(LS_SIDEBAR) === "collapsed") app.classList.add("sidebar-collapsed");
    } catch (e) {}

    if (sidebar && !sidebar.id) sidebar.id = "site-navigation";
    if (menu) {
      menu.setAttribute("aria-label", "Toggle navigation");
      menu.setAttribute("aria-controls", sidebar ? sidebar.id : "site-navigation");
      menu.setAttribute("aria-expanded", "false");
      menu.addEventListener("click", function () {
        if (isMobile()) {
          setMobileDrawer(!app.classList.contains("nav-open"));
        } else {
          var collapsed = app.classList.toggle("sidebar-collapsed");
          try { localStorage.setItem(LS_SIDEBAR, collapsed ? "collapsed" : "open"); } catch (e) {}
        }
      });
    }

    if (backdrop) backdrop.addEventListener("click", function () { setMobileDrawer(false); });
    if (close) close.addEventListener("click", function () { setMobileDrawer(false, true); });
    if (sidebar) sidebar.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { setMobileDrawer(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && app.classList.contains("nav-open")) setMobileDrawer(false, true);
    });

    // Keep drawer state and accessibility attributes correct across the breakpoint.
    window.addEventListener("resize", function () {
      setMobileDrawer(isMobile() && app.classList.contains("nav-open"));
    });
    setMobileDrawer(false);
  }

  /* ---------- Smooth page transitions ----------
     A subtle fade-out → navigate → fade-in between same-site pages. Where the
     browser supports the View Transitions API we use a true crossfade; elsewhere
     we fall back to fading the content out (CSS .is-leaving) before navigating,
     and the CSS page-enter animation fades the next page in. Honors
     prefers-reduced-motion and never interferes with normal browser behaviour. */
  var REDUCED_MOTION = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function isPlainLeftClick(e) {
    return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
  }

  function shouldIntercept(a, e) {
    if (!a || !isPlainLeftClick(e) || e.defaultPrevented) return false;
    if (a.target && a.target !== "" && a.target !== "_self") return false;   // new tab/window
    if (a.hasAttribute("download")) return false;
    var href = a.getAttribute("href");
    if (!href || href.charAt(0) === "#") return false;                       // in-page anchor
    if (/^(mailto:|tel:|javascript:)/i.test(href)) return false;
    // resolve to compare origin + path
    var url;
    try { url = new URL(a.href, location.href); } catch (e2) { return false; }
    if (url.origin !== location.origin) return false;                        // external site
    // same document (only the hash differs) → let the browser handle it
    if (url.pathname === location.pathname && url.search === location.search) return false;
    // only animate navigations to our own .html pages (or directory roots)
    if (!/\.html?$|\/$/.test(url.pathname)) return false;
    return url.href;
  }

  function setupPageTransitions() {
    if (REDUCED_MOTION) return;   // respect the user's preference — no transitions

    // Any browser with the View Transitions API handles the transition via CSS
    // (`@view-transition`), and the CSS gates the JS-fallback styling behind
    // `@supports not (view-transition-name)`. So if VT is supported at all, the
    // JS fade would either double up or have no styling to apply — skip it and
    // keep the two paths perfectly aligned with the CSS.
    var hasVT = (window.CSS && CSS.supports && CSS.supports("view-transition-name: none"));
    if (hasVT) return;

    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("a[href]");
      var dest = shouldIntercept(a, e);
      if (!dest) return;
      e.preventDefault();
      // Fade the content out, then navigate; the next page's CSS page-enter
      // animation fades it in — giving a smooth out→in between pages.
      document.documentElement.classList.add("is-leaving");
      window.setTimeout(function () { window.location.href = dest; }, 180);
    });

    // Safety net: if navigation is somehow cancelled, or the page is restored
    // from the back/forward cache, clear the leaving state so it isn't stuck
    // faded out.
    window.addEventListener("pageshow", function () {
      document.documentElement.classList.remove("is-leaving");
    });
  }

  function init() { buildSidebar(); buildMobileDrawerChrome(); setupSearch(); fixBrand(); syncSequentialPageNav(); injectFooter(); setupSidebarToggle(); setupPageTransitions(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  // expose for debugging / other scripts
  window.SiteNav = { groups: GROUPS, href: href, current: current, currentGroup: currentGroup };
})();
