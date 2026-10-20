(function () {
  "use strict";

  var launcher = document.getElementById("l1c-chat-launcher"),
    panel = document.getElementById("l1c-chat-panel"),
    closeButton = document.getElementById("l1c-chat-close"),
    messages = document.getElementById("l1c-chat-messages"),
    suggestions = document.getElementById("l1c-chat-suggestions"),
    form = document.getElementById("l1c-chat-form"),
    input = document.getElementById("l1c-chat-input"),
    fields = [
      ["eventType", "What type of event are you planning?"],
      ["objective", "What is the primary objective of the event?"],
      ["location", "Which city or country would you prefer?"],
      ["timeframe", "Do you have a preferred date or timeframe?"],
      ["attendees", "Approximately how many attendees do you expect?"],
      ["requirements", "Will you need speakers, networking, hybrid participation, or special production?"],
      ["budget", "Do you have an estimated budget range you’re comfortable sharing? You can skip this."],
      ["name", "What name should the team use when following up? You can skip this."],
      ["company", "Which company or organization do you represent? You can skip this."],
      ["email", "What is the best business email address for follow-up? You can skip this."],
      ["additional", "Is there anything else the L1C team should know? You can skip this."]
    ],
    events = [
      {
        slug: "executive-leaders-dinner",
        title: "Executive Leaders Dinner",
        date: "2026-11-12",
        location: "London, United Kingdom",
        description: "A leadership gathering designed to encourage executive relationships and meaningful professional discussions."
      },
      {
        slug: "technology-leadership-summit",
        title: "Technology Leadership Summit",
        date: "2027-02-18",
        location: "London, United Kingdom",
        description: "A business and technology leadership event focused on executive perspectives, industry developments, and professional connections."
      },
      {
        slug: "executive-networking-evening",
        title: "Executive Networking Evening",
        date: "2027-04-22",
        location: "Paris, France",
        description: "A professional networking experience designed to bring executives and business leaders together."
      }
    ],
    starters = [
      "What services does Level One Connect offer?",
      "I want to organize a corporate conference.",
      "What upcoming events can I attend?",
      "Can you organize an executive networking event?",
      "How does your event planning process work?",
      "Can you organize an international event?",
      "How can my company become a partner?",
      "I would like to arrange a consultation.",
      "Can you help us plan a product launch?",
      "How do you measure event success?",
      "Can you organize a hybrid event?",
      "Can you help us coordinate speakers?",
      "What makes Level One Connect different?",
      "I would like to discuss a customized event.",
      "How can I speak with your team?"
    ],
    contactHref = document.querySelector('[data-chat-link="contact"]').getAttribute("href"),
    planningHref = document.querySelector('[data-chat-link="planning"]').getAttribute("href"),
    eventsHref = document.querySelector('[data-chat-link="events"]').getAttribute("href"),
    qualifying = false,
    answers = Object.create(null);

  function addMessage(text, sender, links) {
    var message = document.createElement("div"),
      bubble = document.createElement("div");
    message.className = "l1c-chat-message l1c-chat-" + sender;
    bubble.className = "l1c-chat-bubble";
    bubble.textContent = text;
    message.appendChild(bubble);
    messages.insertBefore(message, suggestions);

    if (links && links.length) {
      var linkGroup = document.createElement("div");
      linkGroup.className = "l1c-chat-message-links";
      links.forEach(function (link) {
        var anchor = document.createElement("a");
        anchor.className = "l1c-chat-action";
        anchor.href = link.href;
        anchor.textContent = link.label;
        linkGroup.appendChild(anchor);
      });
      messages.insertBefore(linkGroup, suggestions);
    }
    messages.scrollTop = messages.scrollHeight;
  }

  function link(label, href) {
    return { label: label, href: href };
  }

  function eventLink(event) {
    var anchor = document.querySelector('[data-chat-event="' + event.slug + '"]');
    return link("Event details", anchor.getAttribute("href"));
  }

  function eventDate(date) {
    var parts = date.split("-").map(Number);
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(new Date(parts[0], parts[1] - 1, parts[2]));
  }

  function eventHasPassed(date) {
    var parts = date.split("-").map(Number),
      eventDay = new Date(parts[0], parts[1] - 1, parts[2]),
      today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDay < today;
  }

  function upcomingEvents() {
    var upcoming = events.filter(function (event) {
      return !eventHasPassed(event.date);
    });
    if (!upcoming.length) {
      return {
        text: "The featured events I have information about have all passed. Please contact the L1C team to ask about future editions.",
        links: [link("Contact the team", contactHref), link("Browse events", eventsHref)]
      };
    }

    var text = "Here are the featured upcoming L1C events:\n\n" +
      upcoming.map(function (event) {
        return event.title + " — " + eventDate(event.date) + " · " + event.location +
          "\n" + event.description;
      }).join("\n\n") +
      "\n\nI don’t have confirmed registration or availability information. The team can provide further details.";
    return {
      text: text,
      links: upcoming.map(eventLink).concat([link("Contact the team", contactHref)])
    };
  }

  function namedEvent(message) {
    var text = message.toLowerCase();
    return events.filter(function (event) {
      return text.indexOf(event.title.toLowerCase()) !== -1 ||
        (event.slug === "executive-leaders-dinner" && /\b(leaders dinner|leadership dinner)\b/.test(text)) ||
        (event.slug === "technology-leadership-summit" && /\b(technology summit|tech leadership summit)\b/.test(text)) ||
        (event.slug === "executive-networking-evening" && /\b(networking evening|paris networking)\b/.test(text));
    })[0];
  }

  function eventDetails(event) {
    if (eventHasPassed(event.date)) {
      return {
        text: event.title + " took place on " + eventDate(event.date) + " in " + event.location +
          ". Please contact the L1C team to ask about future editions.",
        links: [link("Contact the team", contactHref), link("Browse events", eventsHref)]
      };
    }
    return {
      text: event.title + " is scheduled for " + eventDate(event.date) + " in " + event.location +
        ". " + event.description +
        "\n\nI don’t have confirmed registration, availability, venue, speaker, or schedule information. Please contact the L1C team for clarification.",
      links: [eventLink(event), link("Contact the team", contactHref)]
    };
  }

  function faq(message) {
    var text = message.toLowerCase(),
      event = namedEvent(message);

    if (/\b(who are you|your name|what are you|are you (?:a )?human|real person)\b/.test(text)) {
      return { text: "I’m L1C’s AI assistant, not a human employee. I can help with the company’s services, featured events, and preparing an event enquiry." };
    }
    if (/\b(speak|talk|contact|human|representative|team|person)\b/.test(text)) {
      return {
        text: "You can reach the L1C team through the official contact form. This chat cannot submit or deliver an enquiry for you.",
        links: [link("Contact the L1C team", contactHref)]
      };
    }
    if (event) return eventDetails(event);
    if (/\b(upcoming|next event|what events?|which events?|featured events|event dates|events can i attend|events are there|event calendar)\b/.test(text)) {
      return upcomingEvents();
    }
    if (/\b(register|registration|availability|available|reserve|book a seat|sign up|applications open)\b/.test(text)) {
      return {
        text: "I can share the featured event dates and locations, but I can’t verify registration or availability. Please contact the L1C team for current details.",
        links: [link("Contact the L1C team", contactHref), link("Browse events", eventsHref)]
      };
    }
    if (/\b(partner|partnership|collaborat|sponsor)\b/.test(text)) {
      return {
        text: "Organizations interested in partnering with L1C can share their objectives and collaboration ideas through the contact form. The team can explore suitable opportunities with you.",
        links: [link("Contact the L1C team", contactHref)]
      };
    }
    if (/\b(service|services|offer|provide|capabilit|what can l1c|what does l1c do)\b/.test(text)) {
      return {
        text: "L1C offers corporate event planning for conferences, business summits, product launches, and annual gatherings; executive networking; and strategic event consulting. Planning can include concept development, brand integration, venue and vendor coordination, logistics, speakers, on-site management, and post-event reporting. Additional services include speaker management, hybrid production, post-event analysis, team building, award ceremonies, and international event coordination. Support can range from the initial idea through execution and evaluation, depending on your project."
      };
    }
    if (/\b(networking|leadership dinner|executive dinner|matchmaking)\b/.test(text)) {
      return {
        text: "Yes. L1C creates executive networking experiences such as leadership dinners and industry gatherings, with targeted invitations, strategic matchmaking, attendee engagement, and follow-up support. The goal is to encourage meaningful professional relationships, knowledge sharing, collaboration, and business opportunities."
      };
    }
    if (/\b(strategy|consult|objective|goal setting|audience analysis|roi)\b/.test(text)) {
      return {
        text: "L1C’s strategic event consulting helps align goals, audience analysis, event concepts, engagement, technology, sustainability, and risk planning with your business objectives. Success measures can be agreed in advance and may include attendee feedback, engagement, networking outcomes, and other relevant indicators."
      };
    }
    if (/\b(speaker|speakers|keynote)\b/.test(text)) {
      return {
        text: "L1C’s speaker management can include sourcing, coordination, contracting, briefing, and logistics. I don’t have confirmed speakers for the featured events; please contact the team for event-specific information.",
        links: [link("Contact the L1C team", contactHref)]
      };
    }
    if (/\b(hybrid|virtual|online event)\b/.test(text)) {
      return {
        text: "Yes. L1C offers hybrid event production that integrates in-person and virtual participation. The right format and technology depend on your audience, objectives, and event requirements."
      };
    }
    if (/\b(international|global|overseas|abroad|emea|united states|united kingdom)\b/.test(text)) {
      return {
        text: "L1C works across the United States, the United Kingdom, EMEA, and other international markets. The team can discuss local requirements, cross-cultural communication, and international logistics for your preferred location."
      };
    }
    if (/\b(process|timeline|how long|stages|phases|planning process)\b/.test(text)) {
      return {
        text: "L1C uses a four-stage process:\n\n1. Discovery and strategy — consultation, audience analysis, goals, and budget planning (typically 2–4 weeks).\n2. Concept and design — creative concept, brand integration, venue selection, and program design (typically 3–6 weeks).\n3. Planning and coordination — logistics, technology, and speakers (typically 4–12 weeks).\n4. Execution and post-event analysis — on-site delivery, attendee experience, and measurement; post-event analysis typically takes 2–4 weeks.\n\nThese are indicative durations. The actual timeline depends on the event’s complexity and requirements."
      };
    }
    if (/\b(case stud|success stor|technology leaders summit 2023|business leaders forum|innovation product reveal|reported results|results did|guarantee|same results|same roi)\b/.test(text)) {
      return {
        text: "L1C reports these as case-study examples: Technology Leaders Summit 2023 — 500+ industry leaders, 92% attendee satisfaction, 45+ partnerships, and 280% reported ROI; Business Leaders Forum — 150+ C-level executives from four countries, 85% new connections, €2.3 million in deals facilitated, and 97% said they would attend again; Innovation Product Reveal — 150% reported media coverage, 3,200 social reach, and €850,000 in pre-orders. These reported outcomes are examples, not guarantees of future results. L1C cannot guarantee identical results for a future event."
      };
    }
    if (/\b(mission|vision|values|different|why l1c|what makes|established|since 2020|what is l1c|what is level one connect|who is l1c|who is level one connect|about l1c)\b/.test(text)) {
      return {
        text: "Established in 2020, Level One Connect aims to turn business gatherings into strategic opportunities for connection, collaboration, innovation, and growth. Its mission is to create exceptional event experiences with measurable business value, and its vision is to become a leading event partner across the UK and EMEA. L1C combines strategic planning, personalized design, industry knowledge, executive engagement, and professional coordination. Its values include excellence, integrity, innovation, collaboration, client-centricity, strategic thinking, continuous improvement, and sustainability."
      };
    }
    if (/\b(consultation|consult|customized|customised|product launch|conference|summit|team building|award ceremon|full service|from beginning|end to end)\b/.test(text)) {
      return {
        text: "L1C can discuss a tailored event based on your organization’s objectives, audience, location, and requirements. Support may include concept development, venue and vendor coordination, logistics, speakers, on-site management, and post-event evaluation.",
        links: [link("Start planning", planningHref), link("Contact the L1C team", contactHref)]
      };
    }
    if (/^\s*(hi|hello|hey|good morning|good afternoon|good evening)\b/.test(text)) {
      return { text: "Hello! Welcome to Level One Connect. What would you like to know about our services, events, or planning process?" };
    }
    if (/\b(thank you|thanks|thankful)\b/.test(text)) {
      return { text: "You’re welcome. I’m happy to help with any other questions about L1C." };
    }
    if (/\b(help|what can you do)\b/.test(text)) {
      return { text: "I can explain L1C’s services and planning process, share information about featured events, and help you prepare an event enquiry. What would you like to explore?" };
    }
    return null;
  }

  function inferEventType(message) {
    var text = message.toLowerCase();
    if (/\b(product launch|product reveal)\b/.test(text)) return "Product launch";
    if (/\b(networking|leadership dinner|executive dinner)\b/.test(text)) return "Executive networking event";
    if (/\b(hybrid)\b/.test(text)) return "Hybrid event";
    if (/\b(award|ceremony|gala)\b/.test(text)) return "Award ceremony or gala";
    if (/\b(team building)\b/.test(text)) return "Team-building event";
    if (/\b(summit)\b/.test(text)) return "Business summit";
    if (/\b(conference)\b/.test(text)) return "Corporate conference";
    if (/\b(international)\b/.test(text)) return "International event";
    return "";
  }

  function nextQuestion() {
    var next = fields.filter(function (field) {
      return !Object.prototype.hasOwnProperty.call(answers, field[0]);
    })[0];
    if (next) return next[1];

    qualifying = false;
    var summary = fields.filter(function (field) {
      return answers[field[0]] && answers[field[0]] !== "Skipped";
    }).map(function (field) {
      var labels = {
        eventType: "Event type",
        objective: "Objective",
        location: "Preferred location",
        timeframe: "Timeframe",
        attendees: "Expected attendees",
        requirements: "Requirements",
        budget: "Budget",
        name: "Name",
        company: "Organization",
        email: "Business email",
        additional: "Additional notes"
      };
      return labels[field[0]] + ": " + answers[field[0]];
    });
    return "Thank you. Here’s a summary to help you prepare for a conversation with the L1C team:\n\n" +
      (summary.length ? summary.join("\n") : "No event details were shared.") +
      "\n\nThis chat does not submit or save your enquiry. To share these details with the team, use the official contact form.";
  }

  function isFaqQuestion(message) {
    return /\b(what|which|when|where|who|why|how|can you|do you|does l1c|is there|are there|tell me|speak|contact|register|registration|available|availability|upcoming|services|process|mission|vision|partner|speaker|hybrid|international)\b/i.test(message);
  }

  function handleQualification(message) {
    var current = fields.filter(function (field) {
      return !Object.prototype.hasOwnProperty.call(answers, field[0]);
    })[0];
    if (!current) return { text: nextQuestion(), links: [link("Contact the L1C team", contactHref)] };

    if (/\b(skip|pass|rather not|prefer not|not comfortable|don’t want to|don't want to)\b/i.test(message)) {
      answers[current[0]] = "Skipped";
      return { text: nextQuestion(), links: qualifying ? [] : [link("Contact the L1C team", contactHref)] };
    }

    if (current[0] === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(message.trim())) {
      return {
        text: "That doesn’t look like a complete email address. You can enter a business email address or skip this question.",
        links: []
      };
    }

    if (isFaqQuestion(message)) {
      var answer = faq(message);
      if (answer) {
        answer.text += "\n\n" + current[1];
        return answer;
      }
    }

    answers[current[0]] = message.trim();
    var question = nextQuestion();
    return {
      text: question,
      links: qualifying ? [] : [link("Contact the L1C team", contactHref)]
    };
  }

  function isPlanningRequest(message) {
    var text = message.toLowerCase();
    return /\b(i(?:’|')?d like to|i would like to|i want to|we(?:’|')?d like to|we would like to|we want to|help (?:me|us) (?:plan|organize|organise)|can you (?:help us|organize|organise|plan)|(?:organize|organise|plan|host) (?:a|an|my|our))\b/.test(text) &&
      /\b(event|conference|summit|networking|dinner|launch|gathering|meeting|team building|ceremony|consultation)\b/.test(text) ||
      /\bhow (?:can|do) (?:i|we) (?:start|begin) (?:planning|to plan) (?:an? )?(?:event|conference|summit|launch|gathering)?\b/.test(text);
  }

  function startQualification(message) {
    qualifying = true;
    answers = Object.create(null);
    var type = inferEventType(message);
    if (type) answers.eventType = type;
    return {
      text: "I’d be glad to help you prepare for an initial discussion. I’ll ask a few optional questions, one at a time. Your answers stay in this chat and are not sent to the team.\n\n" + nextQuestion(),
      links: []
    };
  }

  function respond(message) {
    if (qualifying) return handleQualification(message);
    if (isPlanningRequest(message)) return startQualification(message);
    return faq(message) || {
      text: "I’m not sure about that, and I don’t want to guess. I can help with L1C’s services, featured events, planning approach, or event enquiries. For other details, please ask the L1C team.",
      links: [link("Contact the L1C team", contactHref)]
    };
  }

  function sendMessage(message) {
    var clean = message.trim();
    if (!clean) return;
    addMessage(clean, "user");
    suggestions.hidden = true;
    input.value = "";
    input.focus();
    window.setTimeout(function () {
      var result = respond(clean);
      addMessage(result.text, "bot", result.links);
    }, 280);
  }

  function setOpen(open) {
    panel.setAttribute("aria-hidden", String(!open));
    launcher.setAttribute("aria-expanded", String(open));
    if (open) input.focus();
    else launcher.focus();
  }

  starters.forEach(function (starter) {
    var button = document.createElement("button");
    button.className = "l1c-chat-suggestion";
    button.type = "button";
    button.textContent = starter;
    button.addEventListener("click", function () {
      sendMessage(starter);
    });
    suggestions.appendChild(button);
  });

  launcher.addEventListener("click", function () {
    setOpen(panel.getAttribute("aria-hidden") !== "false");
  });
  closeButton.addEventListener("click", function () {
    setOpen(false);
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && panel.getAttribute("aria-hidden") === "false") setOpen(false);
  });
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    sendMessage(input.value);
  });
})();
