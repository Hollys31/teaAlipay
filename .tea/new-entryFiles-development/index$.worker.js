
require('./config$.js?appxworker=1');
require('./importScripts$.js?appxworker=1');
function success() {
require('../..//app.js?appxworker=1');
require('../../components/icon/icon.js?appxworker=1');
require('../../components/loading/loading.js?appxworker=1');
require('../../components/tabbarBottom/tabbarBottom.js?appxworker=1');
require('../../components/tabBar/tabBar.js?appxworker=1');
require('../../pages/scanQRCode/scanQRCode.js?appxworker=1');
require('../../pages/index/index.js?appxworker=1');
require('../../pages/environmentChart/index.js?appxworker=1');
require('../../pages/feedback/feedback.js?appxworker=1');
require('../../pages/video/video.js?appxworker=1');
require('../../pages/teaPlantation/teaPlantation.js?appxworker=1');
require('../../pages/start/start.js?appxworker=1');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
