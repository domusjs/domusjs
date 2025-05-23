import { NodeSDK } from '@opentelemetry/sdk-node';
import { getDefaultConfig } from './config/otel.config';

export const setupObservability = ({
  config = getDefaultConfig(),
  instrumentations = [],
}: {
  config?: Partial<ConstructorParameters<typeof NodeSDK>[0]>;
  instrumentations?: any[];
}) => {
  const sdk = new NodeSDK({
    ...config,
    instrumentations,
  });

  sdk.start();
  return sdk;
};
