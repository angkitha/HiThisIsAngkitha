import { projectAssets } from "../assets/projects";

const PAGES = [projectAssets.dashHome, projectAssets.dashBoards, projectAssets.dashWorkflows];

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

export function DashboardCase({
  onPreview,
}: {
  onPreview: (src: string, images: string[]) => void;
}) {
  return (
    <div className="fintech-case dashboard-case">
      <div className="project-overlay__image">
        <img className="dashboard-case__hero" alt="" src={projectAssets.dashHero} />
      </div>
      <div className="project-overlay__meta">
        <div className="project-overlay__meta-item">
          <span>INDUSTRY</span>
          <span className="project-overlay__chip">FINANCE, TECH</span>
        </div>
        <div className="project-overlay__meta-item">
          <span>DURATION</span>
          <span className="project-overlay__chip">JULY 2026 - SEPTEMBER 2026</span>
        </div>
        <div className="project-overlay__meta-item">
          <span>LINK TO DEMO</span>
          <a
            className="project-overlay__chip project-overlay__chip--plain"
            href="https://drive.google.com/file/d/16pDh7yiWEdCVeYw0e6qsgTMDxYZAAJ7c/view?usp=sharing"
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
              The major financial firm our team consulted for faced major delays in task processing;
              tasks went unlinked, workflows went uncharted, and managers had no easy insight into
              the tasks of the employees they oversaw. Users were forced to use multiple different
              platforms to get a few simple tasks done, bogging down the entire workflow entire
              system and adding to employee cognitive load.
            </p>
          </article>
          <article className="fintech-case__card">
            <p className="fintech-case__card-title">My Ownership</p>
            <p>
              I was in charge of designing a functional prototype solution to the problem this firm
              was facing. This meant I needed to perform applicable competitive analyses, gather
              user interviews, and generate design solutions from 0-to-1.
            </p>
          </article>
        </div>
        <div className="fintech-case__audit">
          <div className="fintech-case__shot dashboard-case__audit">
            <img alt="" src={projectAssets.dashAudit} />
            <span className="dashboard-case__bar dashboard-case__bar--1" />
            <span className="dashboard-case__bar dashboard-case__bar--2" />
            <span className="dashboard-case__bar dashboard-case__bar--3" />
            <span className="dashboard-case__bar dashboard-case__bar--4" />
            <span className="dashboard-case__bar dashboard-case__bar--5" />
            <span className="dashboard-case__bar dashboard-case__bar--6" />
            <span className="dashboard-case__bar dashboard-case__bar--7" />
            <span className="dashboard-case__bar dashboard-case__bar--8" />
          </div>
          <div className="fintech-case__note">
            <p>
              I explored the firm’s existing platforms to understand how users moved through their
              daily tasks and where they were getting stuck. Users worked across too many open tabs
              and browser windows, making it easy to lose context when switching between tasks. Each
              platform also had a different UI, requiring users to adjust how they interacted with
              each one. Some had outdated interfaces with small text and minimal spacing, making
              information harder to read and adding to the effort required to complete simple tasks.
            </p>
            <p>
              The dashboards were static, with no way for users to customize their views around
              their roles. Users had to piece together the available information to determine their
              next steps. If they needed a new dashboard view, they had to submit a ticket and wait
              anywhere from 1–4 days, further delaying their work.
            </p>
            <p>
              Managers faced a similar lack of visibility. There was no streamlined way to review
              their employees’ progress or identify where tasks were getting held up. Instead,
              blockers had to be brought to their attention through emails or meetings. Managers
              were also responsible for mapping workflows themselves or maintaining them in outdated
              platforms, adding more manual work to an already fragmented process.
            </p>
          </div>
        </div>
      </section>

      <section className="fintech-case__block">
        <h2 className="fintech-case__heading">Competitor Analysis and Research</h2>
        <div className="fintech-case__prose">
          <p>
            I began by researching tools used by other major financial firms to understand how they
            brought information and workflows into one place. In a previous project, I had explored
            bringing the tools a user needed onto one streamlined page. I wanted to build on that
            approach for this firm’s new “one-stop platform,” while exploring where AI could help
            users find information and act on it.
          </p>
          <p>
            I also researched Jira to understand how it supported workflow management, focusing on
            how tasks were organized, progress was communicated, and dependencies were made visible.
            Alongside this, I reviewed screens on Mobbin for examples of how complex workflows could
            be presented clearly and how navigation could stay consistent across different views.
          </p>
          <p>
            To understand what employees actually needed, I conducted user interviews across three
            role levels. In total, I interviewed 9 employees, 3 of each role level. I explored what
            each role needed to see, which actions they performed regularly, and where they depended
            on others to move work forward. I then compared these needs to identify which
            functionality could be shared and which views needed to adapt by role. The aim was to
            create one platform with familiar interaction patterns across roles, while giving each
            user the information and tools relevant to their responsibilities.
          </p>
        </div>
      </section>

      <section className="fintech-case__block">
        <h2 className="fintech-case__heading">User Persona</h2>
        <p className="fintech-case__intro">
          Using the information I gathered during my user interview sessions, I crafted the following
          2 user personas.
        </p>
        <div className="fintech-case__personas">
          <article className="fintech-persona">
            <PersonaTicks />
            <div className="fintech-persona__top">
              <div className="fintech-persona__photo fintech-persona__photo--isha">
                <img alt="" src={projectAssets.dashJonathan} />
              </div>
              <div className="fintech-persona__intro">
                <p className="fintech-persona__name">Jonathan Ramirez</p>
                <p className="fintech-persona__role">Employee, 3 yrs experience</p>
                <p className="fintech-persona__quote">
                  “I need to know what to tackle first and have the information ready, without
                  chasing updates or starting from scratch every time.”
                </p>
              </div>
            </div>
            <div className="fintech-persona__bottom">
              <div className="fintech-persona__col">
                <p className="fintech-persona__label">Goals</p>
                <ol>
                  <li>Organize daily tasks by priority and quickly identify what needs attention.</li>
                  <li>Coordinate with coworkers to move shared tasks forward.</li>
                  <li>Find relevant information in data-heavy dashboards.</li>
                  <li>Use reusable templates to complete similar tasks consistently.</li>
                </ol>
              </div>
              <div className="fintech-persona__col">
                <p className="fintech-persona__label">Frustrations</p>
                <ol>
                  <li>Managing numerous tasks makes it difficult to keep track of priorities.</li>
                  <li>Moving work forward requires repeated back-and-forth with coworkers.</li>
                  <li>Dense dashboards make essential information hard to find.</li>
                  <li>Similar tasks require repetitive setup because there is no standardized template.</li>
                </ol>
              </div>
            </div>
          </article>
          <article className="fintech-persona">
            <PersonaTicks />
            <div className="fintech-persona__top">
              <div className="fintech-persona__photo fintech-persona__photo--jason">
                <img alt="" src={projectAssets.dashJyothi} />
              </div>
              <div className="fintech-persona__intro">
                <p className="fintech-persona__name">Jyothi Sharma</p>
                <p className="fintech-persona__role">Manager, 20+ yrs experience</p>
                <p className="fintech-persona__quote fintech-persona__quote--strong">
                  “I want to see where work is stuck and who has capacity without having to ask
                  everyone for an update.”
                </p>
              </div>
            </div>
            <div className="fintech-persona__bottom">
              <div className="fintech-persona__col">
                <p className="fintech-persona__label">Goals</p>
                <ol>
                  <li>Quickly identify blocked tasks and help employees resolve them.</li>
                  <li>See employee workloads to determine where to allocate work.</li>
                  <li>Assign work based on available capacity with fewer manual check-ins.</li>
                  <li>Understand how tasks move through workflows and where delays occur.</li>
                </ol>
              </div>
              <div className="fintech-persona__col">
                <p className="fintech-persona__label">Frustrations</p>
                <ol>
                  <li>Blockers remain hidden until employees bring them up.</li>
                  <li>Assessing team capacity requires frequent conversations and follow-ups.</li>
                  <li>Allocating work depends on manually gathering updates from employees.</li>
                  <li>
                    Limited workflow visibility makes it difficult to pinpoint what is holding up
                    progress.
                  </li>
                </ol>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="fintech-case__block">
        <h2 className="fintech-case__heading">Process and Results</h2>
        <div className="fintech-case__pills">
          <p className="fintech-case__pill">Pending Results</p>
        </div>
        <div className="fintech-case__results">
          <div className="dashboard-case__collages">
            <p className="fintech-case__hint">Click on images to review annotations!</p>
            <div className="fintech-case__collage-stack">
              <button type="button" className="dashboard-case__shot--home" onClick={() => onPreview(PAGES[0], PAGES)}>
                <img alt="" src={PAGES[0]} />
              </button>
              <div className="fintech-case__collage-pair">
                <button type="button" className="dashboard-case__shot--boards" onClick={() => onPreview(PAGES[1], PAGES)}>
                  <img alt="" src={PAGES[1]} />
                </button>
                <button type="button" className="dashboard-case__shot--flows" onClick={() => onPreview(PAGES[2], PAGES)}>
                  <img alt="" src={PAGES[2]} />
                </button>
              </div>
            </div>
          </div>
          <div className="fintech-case__results-copy">
            <p>
              I designed the Home page to give users a clear starting point for their day, with
              quick actions and important data points that needed attention. A map also provided a
              visual overview of the areas they oversaw, helping users move from a broader view into
              specific responsibilities.
            </p>
            <p>
              The “Your Dashboards” page gave users more control over how they viewed their data.
              They could create multiple dashboards using AI, saved templates, or a blank canvas,
              then customize the widgets within each one. I drew inspiration from Shopify and iOS
              editing experiences to make customization feel familiar. Users could change both the
              data being compared and how it was displayed, choosing a view that best supported the
              task at hand. An AI analysis tool surfaced key information alongside quick actions,
              helping users move from reviewing data to acting on it.
            </p>
            <p>
              I also designed an AI assistant that users could ask to explain dashboard data,
              identify where work was slowing down, and suggest ways to improve a process. My aim
              was to make it easier for users to understand what they were seeing and determine
              their next steps without having to piece everything together themselves.
            </p>
            <p>
              For managers, the Workflows page brought task ownership, progress, and history into
              one place. When a task passed between multiple employees, managers could trace its
              history and contact the person needed to unblock it without leaving the page. Saved
              workflow templates reduced repetitive setup, while a central notification panel was
              designed to bring updates from legacy platforms into the same experience. The concept
              used AI-enabled workflows to connect tasks that still originated in those systems.
            </p>
            <p>
              Managers could also move between regional overviews and individual employee
              dashboards. Senior managers could use the broader view to support briefs and
              allocation plans, while employee-level views helped them understand workloads and
              identify where support was needed.
            </p>
          </div>
        </div>
      </section>

      <div className="fintech-case__closer">
        <div className="fintech-case__closer-col">
          <p className="fintech-case__tag">FURTHER DETAILS</p>
          <div className="fintech-case__closer-copy">
            <p>
              The prototype was created as an RFP asset and has not yet been released to the
              original client. However, presenting the white-label prototype to another major
              financial firm helped secure a signed SOW and product contract within the first two
              conversations. This was an early commercial success, though its impact on daily task
              completion and employee workflows remains to be measured.
            </p>
            <p>
              This project pushed me to think beyond individual screens and consider how an entire
              platform should work across different roles. I had to balance customization with
              consistency, give managers visibility without overwhelming employees, and connect data
              to actions. It strengthened my ability to design around the relationships between
              people, tasks, and information.
            </p>
          </div>
        </div>
        <div className="fintech-case__closer-col fintech-case__closer-col--end">
          <p className="fintech-case__tag">CONCLUDING THOUGHTS</p>
          <div className="fintech-case__closer-copy">
            <p>
              One of my biggest takeaways was that bringing tools into one platform is only part of
              the solution. Users also need to understand what deserves their attention, who owns
              the next step, and what they can do to move work forward. That became a guiding
              principle for how I approached the dashboards, workflows, and manager views.
            </p>
            <p>
              I also learned to treat customization as a design challenge of its own. Giving users
              more options is useful only if those options are easy to understand. Templates and
              familiar editing patterns offered a starting point while leaving room for users to
              adapt the platform to their needs.
            </p>
            <p>
              The positive client response showed that the concept addressed a recognizable business
              need. The next step would be to test it in everyday use: could employees identify
              priorities more easily, could managers resolve blockers with fewer check-ins, and
              could users customize their dashboards without needing outside support? Those outcomes
              would show whether the design delivered on its intent.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
