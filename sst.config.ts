import { type SSTConfig } from "sst";
import { NextjsSite } from "sst/constructs";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager/lib/certificate";

export default {
  config(_input) {
    return {
      name: "t3-sst-example",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const certificate = Certificate.fromCertificateArn(
        stack,
        "Certificate",
        process.env.AWS_CERTIFICATE_ARN ?? "",
      );

      // Create site
      const site = new NextjsSite(stack, "Site", {
        environment: {
          DATABASE_URL: process.env.DATABASE_URL ?? "",
        },
        customDomain: {
          domainName: "robavo.net",
          cdk: {
            certificate,
          },
        },
      });
      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;
