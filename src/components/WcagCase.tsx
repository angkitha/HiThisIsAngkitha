import { projectAssets } from "../assets/projects";

export function WcagCase() {
  return (
    <div className="fintech-case ds-case">
      <div className="project-overlay__image">
        <img className="wcag-case__hero" alt="" src={projectAssets.wcagHero} />
      </div>
      <div className="project-overlay__meta">
        <div className="project-overlay__meta-item">
          <span>INDUSTRY</span>
          <span className="project-overlay__chip">DESIGN</span>
        </div>
        <div className="project-overlay__meta-item">
          <span>DURATION</span>
          <span className="project-overlay__chip">JUNE 2026</span>
        </div>
        <div className="project-overlay__meta-item">
          <span>LINK TO DEMO</span>
          <a
            className="project-overlay__chip project-overlay__chip--plain"
            href="https://drive.google.com/file/d/1jbClBKtbJXj4VKgV0pOTrRsg8FxerK7n/view"
            target="_blank"
            rel="noreferrer"
          >
            WATCH HERE
          </a>
        </div>
      </div>

      <section className="fintech-case__block">
        <h2 className="fintech-case__heading">Background</h2>
        <p className="ds-case__copy">
          As someone who really values active feedback in my design processes, WCAG standards are
          always something that I must look out for. As the standard protocol for conducting WCAG
          analyses has largely been well documented on the internet, I did not need to establish as
          rigorous of a requirement to the Figma agent whilst constructing this plugin. From start
          to final refinement, this plugin only took approximately 40 minutes to generate. Though I
          acknowledge that it is always best practice to conduct manual WCAG analysis, the plugin is
          a great starting point by which designers can know which areas might need more attention
          and refinement throughout their design processes.
        </p>
        <div className="ds-case__columns">
          <div className="ds-case__column">
            <p className="ds-case__pill">USAGE</p>
            <p className="ds-case__copy">
              Select the screen you would like to conduct a review on and opt for an AA review or
              AAA review. The plugin will then scan through this screen and produce a comprehensive
              score. The report will include scores for each criteria often reviewed by WCAG experts
              along with recommendations on how to improve upon these scores. Each report comes with
              an extensive list of pass fails, making identifying avenues of errors much easier and
              amending them much faster. You may also opt to save the review as a PDF in the case
              you need to conduct multiple reviews throughout your design process.
            </p>
          </div>
          <div className="ds-case__column">
            <p className="ds-case__pill">RESULTS</p>
            <p className="ds-case__copy">
              This plugin is yet to be revealed to the general public yet. I am planning on
              releasing it as part of a toolkit amongst a larger release of design specific plugins.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
