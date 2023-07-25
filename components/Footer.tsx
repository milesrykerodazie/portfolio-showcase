import { footerLinks } from "@/constant";

type ColumnProps = {
  title: string;
  links: Array<string>;
};

const FooterColumn = ({ title, links }: ColumnProps) => (
  <div className="footer_column">
    <h4 className="font-semibold text-primary">{title}</h4>
    <ul className="flex flex-col gap-2 font-normal text-gray-500">
      {links.map((link) => (
        <span key={link}>{link}</span>
      ))}
    </ul>
  </div>
);

const Footer = ({ count }: { count: number }) => (
  <section className="flexStart footer">
    <div className="flex flex-col gap-12 w-full">
      <div className="flex items-start flex-col">
        <img
          src="/images/logo.png"
          alt="logo"
          className=" h-10 object-cover rounded-full"
        />

        <p className="text-start text-xs md:text-sm font-normal mt-5 max-w-xs text-gray-600">
          PortfolioShowcase, the hub for tech professionals to exhibit their
          remarkable creations. Please bear in mind that this build is intended
          for development purposes exclusively.
        </p>
      </div>
      <div className="flex flex-wrap gap-7">
        <FooterColumn
          title={footerLinks[0].title}
          links={footerLinks[0].links}
        />

        <div className="flex-1 flex flex-col gap-4">
          <FooterColumn
            title={footerLinks[1].title}
            links={footerLinks[1].links}
          />
          <FooterColumn
            title={footerLinks[2].title}
            links={footerLinks[2].links}
          />
        </div>

        <FooterColumn
          title={footerLinks[3].title}
          links={footerLinks[3].links}
        />

        <div className="flex-1 flex flex-col gap-4">
          <FooterColumn
            title={footerLinks[4].title}
            links={footerLinks[4].links}
          />
          <FooterColumn
            title={footerLinks[5].title}
            links={footerLinks[5].links}
          />
        </div>

        <FooterColumn
          title={footerLinks[6].title}
          links={footerLinks[6].links}
        />
      </div>
    </div>

    <div className="flexBetween footer_copyright">
      <p className="text-gray-500">Copyright © 2023. All rights reserved</p>
      <p className="text-primary">
        <span className="font-semibold">{count}</span> works showcased.
      </p>
    </div>
  </section>
);

export default Footer;
