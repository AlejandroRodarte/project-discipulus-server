const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const { UserFile } = require('../../../../src/db/models');

const { uniqueUserContext, baseUserRoleContext, baseParentStudentContext } = require('../../../__fixtures__/models');
const db = require('../../../__fixtures__/functions/db');

const { user, parentStudent } = require('../../../../src/db/names');

const uniqueUserContextModelNames = Object.keys(uniqueUserContext.persisted);
const baseUserRoleContextModelNames = Object.keys(baseUserRoleContext.persisted);
const baseParentStudentContextModelNames = Object.keys(baseParentStudentContext.persisted);

const roleTypes = require('../../../../src/util/roles');

const expect = chai.expect;
chai.use(chaiAsPromised);


