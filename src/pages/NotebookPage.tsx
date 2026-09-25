import { NotebookBackground } from "../components/NotebookBackground";

type NotebookPageProps = {
  id: string;
  label: string;
};

export function NotebookPage({ id, label }: NotebookPageProps) {
  return (
    <section className="page" id={id} aria-label={label}>
      <div className="landing landing--plain">
        <NotebookBackground />
      </div>
    </section>
  );
}
