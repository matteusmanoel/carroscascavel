import logo from "@/app/(public)/carros-cascavel-logo.png";

type BrandLogoProps = {
  className?: string;
  alt?: string;
};

export function BrandLogo({ className, alt = "Carros Cascavel" }: BrandLogoProps) {
  return (
    <img
      src={logo.src}
      alt={alt}
      width={logo.width}
      height={logo.height}
      className={className}
    />
  );
}
