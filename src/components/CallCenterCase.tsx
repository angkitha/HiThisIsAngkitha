import { projectAssets } from "../assets/projects";

const PREVIEWS = [projectAssets.callAi, projectAssets.callWizard, projectAssets.callWorkflow];

function PersonaTicks() {
  return (
    <>
      <span className="fintech-persona__tick fintech-persona__tick--tl" aria-hidden="true" />
      <span className="fintech-persona__tick fintech-persona__tick--tr" aria-hidden="true" />
      <span className="fintech-persona__tick fintech-persona__tick--bl" aria-hidden="true" />
      <span className="fintech-persona__tick fintech-persona__tick--br" aria-hidden="true" />
    </>
  );
}

export function CallCenterCase({
  onPreview,
}: {
  onPreview: (src: string, images: string[]) => void;
}) {
  const open = (src: string) => onPreview(src, PREVIEWS);

  return (
    <div className="fintech-case callcenter-case">
      <div className="project-overlay__image">
        <img className="callcenter-case__hero" alt="" src={projectAssets.callHero} />
      </div>
      <div className="project-overlay__meta">
        <div className="project-overlay__meta-item">
          <span>INDUSTRY</span>
          <span className="project-overlay__chip">FINANCE, TECH</span>
        </div>
        <div className="project-overlay__meta-item">
          <span>DURATION</span>
          <span className="project-overlay__chip">JULY 2025 - MAY 2026</span>
        </div>
        <div className="project-overlay__meta-item">
          <span>LINK TO DEMO</span>
          <a
            className="project-overlay__chip project-overlay__chip--plain"
            href="https://drive.google.com/file/d/1Xp8630iNsQRUiwUjPEujA_Tsw3DyQLf6/view"
            target="_blank"
            rel="noreferrer"
          >
            WATCH HERE
          </a>
        </div>
      </div>

      <section className="fintech-case__block">
        <h2 className="fintech-case__heading">Background</h2>
        <div className="fintech-case__cards">
          <article className="fintech-case__card">
            <p className="fintech-case__card-title">The Problem</p>
            <p>
              Our financial technology client used a very outdated data entry platform. The
              platform’s visual design was harsh and monotonous. Numerous client-side employees
              resounded that the UI contributed to their overall workday fatigue. The company sought
              to build a new internal data entry system to streamline data entry processes whilst
              making the platform more personable to their vision.
            </p>
          </article>
          <article className="fintech-case__card">
            <p className="fintech-case__card-title">My Ownership</p>
            <p>
              I owned end-to-end UI design for the Account Registration page (consisting of 32
              sections), the AI assistant, the call widget, and the guided workflow experience.
              Additionally, I was in charge of creating the design system components to use across
              other sections of the page I was not directly in charge of while documenting design
              requirements such that our engineers and clients could comprehend design decisions.
            </p>
          </article>
        </div>
        <div className="fintech-case__audit">
          <div className="fintech-case__shot callcenter-case__audit">
            <img alt="" src={projectAssets.callAudit} />
          </div>
          <div className="fintech-case__note">
            <p>
              Whilst exploring, I noted that the old platform lacked color or branding; the heavy
              emphasis on form-type inputs with an old, grey, dreary UI made it difficult to
              navigate and increased cognitive load.
            </p>
            <p>
              While the platform had a plethora of visual friction points, the issues in its
              functionality were no lesser. Tabs had multiplied over time with no clear hierarchy,
              making it difficult for less experienced employees to orient themselves and find what
              they needed under time pressure. Key information was buried inside nested pages, with
              critical details repeated across multiple areas in ways that created confusion rather
              than clarity. Every button was surfaced immediately, regardless of whether it was
              disabled or enabled in accordance to role-based access.
            </p>
            <p>
              The reduced functionality of the platform was a direct byproduct of its poor visual
              design. Call center representatives would spend too much time navigating from page to
              page and taking notes on call information whilst juggling the callers&apos; demands.
              As a result, the callers’ sentiments would often get lost in translation.
            </p>
            <p>
              We were given 8 months to transform the product to the best of our abilities. Keeping
              their pain points in mind, my design lead and I set to find avenues to bring a modern
              look and feel to a website as complex as this.
            </p>
          </div>
        </div>
      </section>

      <section className="fintech-case__block">
        <h2 className="fintech-case__heading">Competitor Analysis and Research</h2>
        <div className="fintech-case__prose">
          <p>
            To establish a “design guiding star”, we looked to two of the most recognizable names in
            financial services: Bank of America and JPMorgan Chase. We knew that both companies were
            championed for their intuitive design practices. Furthermore, their internal and
            customer-facing platforms handle enormous complexity while still feeling navigable,
            branded, and human.
          </p>
          <p>
            What stood out across our explorations on the platforms of both these companies was
            their well-organized information hierarchy. Both platforms ensured to display all vital
            points of information in a streamlined manner while obscuring less important points of
            entry behind intuitive points of navigation (action buttons, tabs, trees, etc.). Key
            account information surfaced at the top level, supported by clean typographic systems
            and a consistent use of space. In terms of role-based UI access, the platform
            dynamically adapted from the login page, creating a cohesive experience that was devoid
            of unnecessary clutter. Branding was woven throughout the pages with subtle accents and
            consistent, intentional use of colors.
          </p>
          <p>
            In order to truly improve upon the call center experience, I suggested the use of an AI
            assistant similar to Bank of America&apos;s client-facing “Erica” chatbot. Not only would
            this chatbot serve as generic guidance for users when they are not actively in calls,
            but also a live transcript agent with quick actions that appear dynamically as the
            representative interacts with the caller. Once the call concludes, the callers&apos;
            account would populate with a summary of the call, post-call actions, and a sentiment
            analysis. This way, employees could keep track of each client, what their queries might
            be, and could more easily formulate a personalized way to serve them. As I had the most
            knowledge of AI based products, I was tasked with the creation of this portion of the
            website.
          </p>
          <p>
            To further ensure I was building an end product our clients were sure to be happy with,
            I set up a two user interview sessions and invited 12 key stakeholders (client partners,
            employees, contract workers) to ensure that I am building with up-to-date feedback.
            During these sessions, I engaged participants with A/B testing and low-fidelity
            prototype ideations. I chose to research using these strategies as I knew their lived
            work experiences would dictate the foundation on which I build on.
          </p>
        </div>
      </section>

      <section className="fintech-case__block">
        <h2 className="fintech-case__heading">User Persona</h2>
        <p className="fintech-case__intro">
          Using the information I gathered during our initial discovery sessions, I crafted the
          following 2 user personas.
        </p>
        <div className="fintech-case__personas">
          <article className="fintech-persona">
            <PersonaTicks />
            <div className="fintech-persona__top">
              <div className="fintech-persona__photo fintech-persona__photo--isha">
                <img alt="" src={projectAssets.callAlex} />
              </div>
              <div className="fintech-persona__intro">
                <p className="fintech-persona__name">Alex Carter</p>
                <p className="fintech-persona__role">Call Center Agent, 7 yrs experience</p>
                <p className="fintech-persona__quote">
                  “I worry that navigating through multiple windows is slowing down my workflow and
                  disappointing customers.”
                </p>
              </div>
            </div>
            <div className="fintech-persona__bottom">
              <div className="fintech-persona__col">
                <p className="fintech-persona__label">Goals</p>
                <ol>
                  <li>Resolve investor inquiries quickly, accurately, and in a friendly manner</li>
                  <li>Maximize productivity and call efficiency while maintaining empathy</li>
                  <li>Stay compliant with internal protocols and regulatory standards</li>
                  <li>Access tools that anticipate needs and reduce guesswork</li>
                </ol>
              </div>
              <div className="fintech-persona__col">
                <p className="fintech-persona__label">Frustrations</p>
                <ol>
                  <li>Need to manually switch between systems or reference outdated resources</li>
                  <li>Time lost due to manual data entry or unclear process steps</li>
                  <li>
                    High pressure to resolve issues quickly while maintaining quality and compliance
                  </li>
                </ol>
              </div>
            </div>
          </article>
          <article className="fintech-persona">
            <PersonaTicks />
            <div className="fintech-persona__top">
              <div className="fintech-persona__photo fintech-persona__photo--jason">
                <img alt="" src={projectAssets.callJessica} />
              </div>
              <div className="fintech-persona__intro">
                <p className="fintech-persona__name">Jessica Lee</p>
                <p className="fintech-persona__role">Account Manager, 12 yrs experience</p>
                <p className="fintech-persona__quote fintech-persona__quote--strong">
                  “I want to see everything I need in one page. I&apos;m spending too much time
                  looking across pages with too many windows open.”
                </p>
              </div>
            </div>
            <div className="fintech-persona__bottom">
              <div className="fintech-persona__col">
                <p className="fintech-persona__label">Goals</p>
                <ol>
                  <li>
                    Efficiently manage investments and complete transactions with minimal friction
                    or human assistance
                  </li>
                  <li>
                    Retrieve financial documents, such as quarterly statements and tax forms, easily
                  </li>
                  <li>
                    Monitor investment performance and optimize contributions to meet financial
                    milestones
                  </li>
                  <li>Interact with intuitive, AI-driven tools that feel personalized and human</li>
                </ol>
              </div>
              <div className="fintech-persona__col">
                <p className="fintech-persona__label">Frustrations</p>
                <ol>
                  <li>
                    Frustration from navigating complex interfaces that are not personalized to
                    their needs
                  </li>
                  <li>Delays caused by slow or outdated authentication processes</li>
                  <li>Lack of immediate access to up-to-date financial data or records</li>
                </ol>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="fintech-case__block">
        <h2 className="fintech-case__heading">Process and Results</h2>
        <div className="fintech-case__pills">
          <p className="fintech-case__pill">Call Time: 12 min → 4 min</p>
          <p className="fintech-case__pill">Task Completion Time: ↓ 83%</p>
        </div>
        <div className="fintech-case__results">
          <div className="fintech-case__collage">
            <p className="fintech-case__hint">Click on images to review annotations!</p>
            <div className="fintech-case__collage-stack">
              <button className="callcenter-case__shot--ai" type="button" onClick={() => open(projectAssets.callAi)}>
                <img alt="" src={projectAssets.callAi} />
              </button>
              <div className="fintech-case__collage-pair">
                <button
                  className="callcenter-case__shot--wizard"
                  type="button"
                  onClick={() => open(projectAssets.callWizard)}
                >
                  <img alt="" src={projectAssets.callWizard} />
                </button>
                <button
                  className="callcenter-case__shot--workflow"
                  type="button"
                  onClick={() => open(projectAssets.callWorkflow)}
                >
                  <img alt="" src={projectAssets.callWorkflow} />
                </button>
              </div>
            </div>
          </div>
          <div className="fintech-case__results-copy">
            <p>
              The final product improved upon all the identified pain points. It was personable,
              modern, and intuitive. I shaped my design practice around my client&apos;s needs whilst
              maintaining a careful balance such that I did not alienate legacy users.
            </p>
            <p>
              During the synchronous design sessions I held with 8 key stakeholders, I recognized
              that my end users were most comfortable with nested drawer experiences. Via the
              numerous A/B testing sessions I conducted, the rated the end products you see to the
              side the highest. As such, the first major structural shift came through the
              introduction of drawers and layered menus. This change applied to all sections of the
              platform but was especially integral to the Account Registration section. To alleviate
              the problems users experienced whilst navigating through the original Account
              Registration section, I used a combination of drawers and menus to obscure any actions
              users did not interface with often. This left more room on the page for users to
              pinpoint account vitals and overview account data; call center users would find an
              easier time staying oriented on goals.
            </p>
            <p>
              Then came the guided workflow functionality. This process was very connectivity and
              data-heavy; tasks would be linked to one another and be displayed within a drawer with
              a view specific to the user that was viewing it. When said tasks were marked as
              complete, they would link back to the overarching workflow and would then notify the
              managers in charge of that business segment. Since this feature had numerous moving
              parts, I made it my mission to consistently check data linkage with client-side
              analysts and question UI feasibility with backend engineers prior to finalizing
              screens. My aim was to reduce back and forth between client teams and engineering
              teams by building a solid middle ground. Additionally, I consistently checked in with
              colleagues to ensure I was building a feature that was stay useful to their respective
              sections as well.
            </p>
            <p>
              Finally, using my knowledge of LLMs, I generated the call widget and AI Chatbot
              drawer. The stakeholders I had interviewed made it a point that a call assistant would
              be the most beneficial to the work they do. As such, I consolidated the two features,
              combining my knowledge of LLM-enabled chat transcripts to build an experience that
              would boost workflow efficiency. I employed the research I had conducted on chatbots
              like Bank of America’s “Erica” whilst clearly focusing on the functionalities the
              stakeholders theorized would be the most useful to land on the final platform look.
            </p>
          </div>
        </div>
      </section>

      <div className="fintech-case__closer">
        <div className="fintech-case__closer-col">
          <p className="fintech-case__tag">FURTHER DETAILS</p>
          <div className="fintech-case__closer-copy">
            <p>
              By integrating frequent feedback sessions, I built a successful repertoire with the
              client. The AI-assisted call center experience was where my background in both AI and
              UX came together most directly. Average call times dropped from 12 minutes down to 5
              to 6 minutes. The feedback from agents was consistent: finding the right information
              and inputs was finally fast and easy. When debuted to the client&apos;s customer via a
              live demo, it received strong positive feedback. On the other hand, the account wizard
              went through its own feedback process with stakeholders and employees before landing
              on a final design. It balanced simplicity with enough nuance for the client&apos;s
              specific needs, supported role-based controls clearly, and integrated smoothly into
              the broader workflow experience I was also responsible for designing.
            </p>
            <p>
              As someone who frequently interfaced with front-end design and had to collaborate with
              product designers and backend engineers, I focused heavily on building a reusable,
              component-based design system with an emphasis on auto-layout. Though building such a
              comprehensive system for a product as complex as what we were designing added to my
              workload, I knew it would pay off when it came time for knowledge transfer and future
              iterative processes. It also gave the team flexibility to keep building without
              starting from scratch each time.
            </p>
            <p>
              Throughout everything, I kept future iterations in mind. The project ran about 8
              months, and the client had already signaled that they wanted to continue into the
              design of 30+ additional sections to be built off of what we provided them. Every
              design decision I made was one that could be built on.
            </p>
          </div>
        </div>
        <div className="fintech-case__closer-col fintech-case__closer-col--end">
          <p className="fintech-case__tag">CONCLUDING THOUGHTS</p>
          <div className="fintech-case__closer-copy">
            <p>
              This project stands as one of the most comprehensive and impactful pieces of work in
              my portfolio. Taking a platform that was actively fatiguing its users and reshaping it
              into something fast, personal, and genuinely usable was no small task. But the success
              of the product speaks for itself. Reduced call times, positive live demo feedback, a
              scalable design system, and an flexible final product were only a few of the many
              successes I achieved with this design project.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
