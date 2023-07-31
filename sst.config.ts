import { type SSTConfig } from "sst";
import { NextjsSite } from "sst/constructs";
import {
  AaaaRecord,
  ARecord,
  HostedZone,
  RecordTarget,
} from "aws-cdk-lib/aws-route53";
import { DnsValidatedCertificate } from "sst/constructs/cdk/dns-validated-certificate";
import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets";

const domainName = "robavo.net";

export default {
  config(_input) {
    return {
      name: "t3-sst-example",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      // Look up hosted zone
      const hostedZone = HostedZone.fromLookup(stack, "HostedZone", {
        domainName,
      });

      // Create a certificate with alternate domain names
      const certificate = new DnsValidatedCertificate(stack, "Certificate", {
        domainName,
        hostedZone,
        region: "us-east-1",
      });

      // Create site
      const site = new NextjsSite(stack, "Site", {
        environment: {
          DATABASE_URL: process.env.DATABASE_URL ?? "",
        },
        customDomain: {
          domainName,
          cdk: {
            hostedZone,
            certificate,
          },
        },
      });

      // Create A and AAAA records for the alternate domain names
      if (site.cdk) {
        const recordProps = {
          recordName: "bar.my-app.com",
          zone: hostedZone,
          target: RecordTarget.fromAlias(
            new CloudFrontTarget(site.cdk.distribution)
          ),
        };
        new ARecord(stack, "AlternateARecord", recordProps);
        new AaaaRecord(stack, "AlternateAAAARecord", recordProps);
      }

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;
