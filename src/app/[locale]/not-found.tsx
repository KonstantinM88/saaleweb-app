import { useTranslations } from "next-intl";
import { Container } from "@/shared/ui/Container";
import { Button } from "@/shared/ui/Button";

export default function NotFound() {
  const t = useTranslations("NotFound");
  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <p className="font-mono text-sm uppercase tracking-widest text-brand-purple">404</p>
      <h1 className="mt-3 text-3xl font-bold text-dark">{t("title")}</h1>
      <p className="mt-3 max-w-md text-muted">{t("description")}</p>
      <Button href="/" className="mt-8">
        {t("back")}
      </Button>
    </Container>
  );
}
