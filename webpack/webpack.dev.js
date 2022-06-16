import path from "path";
import portFinderSync from "portfinder-sync";
import { merge } from "webpack-merge";
import commonConfiguration from "./webpack.common.js";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const infoColor = (_message) => {
  return `\u001b[1m\u001b[34m${_message}\u001b[39m\u001b[22m`;
};

const config = merge(commonConfiguration, {
  mode: "development",
  devServer: {
    host: "0.0.0.0",
    port: portFinderSync.getPort(8080),
    open: true,
    https: false,
    // after: function (app, server, compiler) {
    //   const port = server.options.port;
    //   const https = server.options.https ? "s" : "";
    //   const localIp = internalIpV4Sync();
    //   const domain1 = `http${https}://${localIp}:${port}`;
    //   const domain2 = `http${https}://localhost:${port}`;

    //   console.log(
    //     `Project running at:\n  - ${infoColor(domain1)}\n  - ${infoColor(
    //       domain2
    //     )}`
    //   );
    // },
  },
});

export default config;
