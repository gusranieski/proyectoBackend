export const testLoggerLevels = (req, res) => {
  req.logger.debug("nivel debug");
  req.logger.http("nivel http");
  req.logger.info("nivel info");
  req.logger.warning("nivel warning");
  req.logger.error("nivel error");
  req.logger.fatal("nivel fatal");
  res.send("Pruebas de niveles de logger");
};
