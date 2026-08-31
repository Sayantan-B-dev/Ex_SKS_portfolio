"use client";

import { useState } from "react";

const FAQS = [
  {
    question: "What kind of events can SKS perform at?",
    answer:
      "The band performs at concerts, corporate meets, weddings, sangeet celebrations, barat processions, galas, and birthday bashes. The set can be shaped around the room, the audience, and the energy you want to build.",
  },
  {
    question: "How many musicians are included in the band?",
    answer:
      "SKS can be booked as a focused 5-member setup or scaled up to a 16-member band. Larger productions can also include dancers and guest artists when the brief calls for a full-stage experience.",
  },
  {
    question: "Can Samrat perform playback and film songs?",
    answer:
      "Yes. Samrat is a playback singer and music director who has worked across Bollywood, OTT, regional films, jingles, and corporate songs. The live repertoire can include his originals alongside audience favourites.",
  },
  {
    question: "Does the band travel for destination events?",
    answer:
      "Yes. Samrat and the team have performed across 40+ countries and major cities in India, including London, Dubai, Singapore, Sydney, Moscow, New York, and destinations across the Caribbean and Southeast Asia.",
  },
  {
    question: "Can the performance include dancers or collaborations?",
    answer:
      "Absolutely. Depending on the production, the show can expand to include up to 48 dancers and collaborations with artists from different parts of the world. Share your stage, schedule, and audience size for a tailored plan.",
  },
  {
    question: "How do I check availability and get a quote?",
    answer:
      "Send the event date, city, venue, event type, and the kind of lineup you have in mind. The SKS team will come back with availability, format options, and a production quote.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="faq-section" aria-labelledby="faq-heading">
      <div className="faq-inner wrap">
        <div className="faq-intro reveal-up">
          <p className="faq-eyebrow">BEFORE THE FIRST NOTE</p>
          <h2 id="faq-heading">
            QUESTIONS
            <br />
            PEOPLE ASK
          </h2>
          <p>
            A quick guide to booking the voice, band, and full live-show
            experience.
          </p>
        </div>
        <div className="faq-list reveal-stagger">
          {FAQS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                className={`faq-item reveal-item${isOpen ? " open" : ""}`}
                key={item.question}
              >
                <button
                  type="button"
                  className="faq-summary"
                  aria-expanded={isOpen}
                  onClick={() => toggle(index)}
                >
                  <span>{item.question}</span>
                  <span className="faq-toggle" aria-hidden="true">
                    +
                  </span>
                </button>
                {isOpen && <p>{item.answer}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
