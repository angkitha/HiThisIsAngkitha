import { projectAssets } from "../assets/projects";

export function DesignSystemCase() {
  return (
    <div className="fintech-case ds-case">
      <div className="project-overlay__image">
        <img className="ds-case__hero-gif" alt="" src={projectAssets.dsHero} />
      </div>
      <div className="project-overlay__meta">
        <div className="project-overlay__meta-item">
          <span>INDUSTRY</span>
          <span className="project-overlay__chip">DESIGN</span>
        </div>
        <div className="project-overlay__meta-item">
          <span>DURATION</span>
          <span className="project-overlay__chip">DECEMBER 2025</span>
        </div>
        <div className="project-overlay__meta-item">
          <span>LINK TO DEMO</span>
          <a
            className="project-overlay__chip project-overlay__chip--plain"
            href="https://www.drive.google.com/file/d/1lQ2CJ9ubuCuCygdMqlOClIw-HirydaSF/view"
            target="_blank"
            rel="noreferrer"
          >
            WATCH HERE
          </a>
        </div>
      </div>

      <section className="fintech-case__block">
        <h2 className="fintech-case__heading">Background</h2>
        <div className="ds-case__prose">
          <p>
            This plugin was a mini project that I had created in my free time to better my skills
            with coding using Cursor and Claude. As a designer working in a firm with fast
            turnarounds, a common complaint I hear from all my colleagues is the lack of time to
            accurately document and generate design systems for clients we might need to generate
            RFPs for.
          </p>
          <p>
            In order to make this plugin, I set up coffee chats with 3 colleagues in their free
            time. I interviewed them to gain more insight into their process of creating a design
            system. I took notes on how each individual tackled the task and compiled one
            comprehensive process to account for all their unique needs. Then, I used Claude to
            better flush out my process to make it more palatable for plugin generation. Once I had
            a skeleton established, I prompted Cursor to generate the plugin.
          </p>
        </div>
        <div className="ds-case__columns">
          <div className="ds-case__column">
            <p className="ds-case__pill">USAGE</p>
            <div className="ds-case__copy">
              <p>The process to use the plugin is as follows:</p>
              <ol>
                <li>
                  Open Design System Figma file. It can be open-source (Ant, Material, etc.) or a
                  custom file your team created
                </li>
                <li>Open “DS Customizer” plugin</li>
                <li>
                  The plugin will start reading the various components you have on your page
                  (buttons, titles, sliders, etc.)
                </li>
                <li>
                  Once the plugin has loaded, you have three of the following opportunities:
                  <ol>
                    <li>
                      Run in a live web URL. The plugin will show you a preview of this site such
                      that you can verify it&apos;s the one you&apos;re thinking of. It will scan
                      this web URL (without the need for an API!), determine a color palette, and
                      display it below the page preview.
                    </li>
                    <li>
                      Run in a branding PDF. The plugin will read this PDF and determine the primary
                      and secondary colors based off of that information.
                    </li>
                  </ol>
                </li>
                <li>
                  Using the color palette the plugin generates, you can choose your primary,
                  secondary, and/or tertiary swatches and restructure the design system&apos;s
                  colors.
                </li>
                <li>
                  Move on to the “Typography” section using the tabs above. Similar to the previous
                  three opportunities, you may restructure the typography of your design system via
                  web URL, PDF, or off of the top most used fonts. You may also opt to add in a
                  secondary font system.
                </li>
                <li>
                  Move on to the “Icons” section using the tabs above. You can preview the icons
                  your design system includes as well as add any you would like using the upload PNG
                  option.
                </li>
                <li>
                  Throughout this entire process, there is a side drawer for you to “Preview” your
                  changes as it applies to a component within your system (i.e. a button)
                </li>
              </ol>
            </div>
          </div>
          <div className="ds-case__column">
            <p className="ds-case__pill">RESULTS</p>
            <p className="ds-case__copy">
              Once finished, I debuted this plugin within our organization’s Git team. Other
              designers were able to download and use the plugin on their local machine; the
              feedback was incredibly positive. Since then, the plugin has been used with 3 internal
              acquisition projects. It reduced the time it took to generate a design system from 2
              days to 1 hour. It reduced avenues for human error and, hence, made design-to-code
              processes more efficient.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
