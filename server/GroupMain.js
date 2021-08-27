const fs = require('fs').promises;
const storage = require('electron-json-storage');
const log = require('electron-log');
const defaultDataPath = storage.getDefaultDataPath();
const GroupListPath = defaultDataPath + '\\GroupList.json';
const AccountListPath = defaultDataPath + '\\AccountList.json';

exports.getGroupList = async () => {
	try { 
		const groupList = await fs.readFile(GroupListPath);
		const { list } = JSON.parse(groupList);
		const result = {
				success: true,
				code: 1,
				data: list,
		};

		return result;
	} catch(error) {
		const result = {
				success: false,
				code: 2,
				log: error.message,
		}

		return result;
	}
};

exports.getFirstGroup = async () => {
	try { 
		const groupList = await fs.readFile(GroupListPath);
		const { list } = JSON.parse(groupList);

    if (!list[0]) {
      const result = {
        success: true,
        code: 2
      };

      return result;
    }

    const result = {
        success: true,
        code: 1,
        data: list[0].id,
    };

    return result;
	} catch(error) {
		const result = {
				success: false,
				code: 2,
				log: error.message,
		}

		return result;
	}
};

exports.createGroup = async (event, newGroupName) => {
	try {
    const groupList = await fs.readFile(GroupListPath);
    const { list, sequence }  = JSON.parse(groupList);
    const _sequence = sequence + 1;
    const newGroupList = {
      sequence: _sequence,
      list: list.concat({
        id: _sequence,
        groupName: newGroupName,
        groupIndex: _sequence,
        updateStatus: false
      })
    };

    fs.writeFile(GroupListPath, JSON.stringify(newGroupList), 'utf8');
    const result = {
      success: true,
      code: 1,
      data: newGroupList.list,
      log: '성공적으로 등록했어요!',
    };

    return result;
  } catch (error) {
    const result = {
      success: false,
      code: 2,
      log: error.message,
    };

    return result;
  }
};

exports.updateGroup = async (event, updateGroupData) => {
	try {
    const GroupList = await fs.readFile(GroupListPath);
    const { sequence } = JSON.parse(GroupList);
    const updateGroupList = {
      sequence,
      list: updateGroupData,
    };

    fs.writeFile(GroupListPath, JSON.stringify(updateGroupList), 'utf8');

    const result = {
      success: true,
      code: 1,
      log: '성공적으로 수정했어요.',
    };
    
    return result;
  } catch (error) {
    const result = {
      success: false,
      code: 2,
      log: error.message,
    };

    return result;
  }
};

exports.removeGroup =  async (event, id) => {
	try {
    const GroupList = await fs.readFile(GroupListPath);
    const parseGroupList = JSON.parse(GroupList);
    const newGroupList = {
      sequence : parseGroupList.sequence,
      list: parseGroupList.list.filter((v) => v.id !== id),
    };

    const AccountList = await fs.readFile(AccountListPath);
    const parseAccountList = JSON.parse(AccountList);
    const filteredAccount = {
      sequence : parseAccountList.sequence,
      list: parseAccountList.list.filter((v) => v.group !== id)
    };

    fs.writeFile(AccountListPath, JSON.stringify(filteredAccount), 'utf8');
    fs.writeFile(GroupListPath, JSON.stringify(newGroupList), 'utf8');

    const result = {
      success: true,
      code: 1,
      data: newGroupList.list,
      log: '성공적으로 삭제했어요.',
    };

    return result;
  } catch(error) {
    const result = {
      success: false,
      code: 2,
      log: error.message,
    };
    
    return result;
  }
};