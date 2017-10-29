/**
 * Created by Henry Huang on 10/29/17.
 */
import gh from 'ghreleases';
import gutil from 'gulp-util';
import moment from  'moment';

const gitHubToken = process.env.GitHubToken;
const branch = process.env.TRAVIS_BRANCH || 'dev';

const auth = {
  token: gitHubToken,
  user: 'henryhuang'
};

const org = 'teambebop6';
const repo = 'imhof';

export default (callback) => {

  gutil.log('creating release...');

  if (!gitHubToken) {
    throw new gutil.PluginError({
      plugin: 'release',
      message: 'GitHubToken environment variable have not defined!'
    })
  }

  const timeTag = moment().format("YYYYMMDDHHmmss");
  const tag_name = branch + '-build-' + timeTag;
  const data = {
    tag_name: tag_name,
    name: 'Build at ' + timeTag,
    body: 'Automatically release from travis.'
  };

  gh.create(auth, org, repo, data, (err) => {
    if (err) {
      throw new gutil.PluginError({
        plugin: 'release',
        message: err.message
      })
    }

    gutil.log('release created!');
    gutil.log('asset uploading...');
    const ref = 'tags/' + tag_name;
    const files = [
      'imhof-dist.zip',
    ];

    gh.uploadAssets(auth, org, repo, ref, files, (err, res) => {
      if (err) {
        throw new gutil.PluginError({
          plugin: 'release',
          message: err.message
        })
      }
      gutil.log('asset uploaded!');
    })
  })
}