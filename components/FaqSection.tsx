"use client";

import { useState } from "react";
import { FAQS } from "@/lib/faqs";

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
