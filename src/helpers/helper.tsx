import RNFS from 'react-native-fs';
import moment from 'moment';
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const copyVideo = async (uri: string, fileName: string) => {
	const destPath = `${RNFS.TemporaryDirectoryPath}/temp_${fileName}.mp4`;
	await RNFS.copyFile(uri, destPath).catch(err => console.log(err));
	await RNFS.stat(destPath);
	return destPath;
}

export const formatDate = (date: Date) => {
	return moment(date).format('MMM Do, YYYY')
}

export const formatDateServer = (date: Date) => {
	return moment(date).format('YYYY-MM-DD')
}

export const isValidEmail = (email: string) => {
	const strongRegex = new RegExp("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$");    
	return strongRegex.test(email)
}

export const storage = new Storage({
	// maximum capacity, default 1000 key-ids
	size: 1000,

	// Use AsyncStorage for RN apps, or window.localStorage for web apps.
	// If storageBackend is not set, data will be lost after reload.
	storageBackend: AsyncStorage, // for web: window.localStorage

	// expire time, default: 1 day (1000 * 3600 * 24 milliseconds).
	// can be null, which means never expire.
	defaultExpires: null,

	// cache data in the memory. default is true.
	enableCache: true,

	// if data was not found in storage or expired data was found,
	// the corresponding sync method will be invoked returning
	// the latest data.
	sync: {
		// we'll talk about the details later.
	}
});

export const saveStorage = (key: string) => {
	storage.save({
		key, // Note: Do not use underscore("_") in key!
		data: "1",
	  
		// if expires not specified, the defaultExpires will be applied instead.
		// if set to null, then it will never expire.
		expires: null
	});
}

export const getStorage = (key: string) => {  
	return new Promise((resolve, reject) => {
		storage
		.load({
			key,

			// autoSync (default: true) means if data is not found or has expired,
			// then invoke the corresponding sync method
			autoSync: true,

			// syncInBackground (default: true) means if data expired,
			// return the outdated data first while invoking the sync method.
			// If syncInBackground is set to false, and there is expired data,
			// it will wait for the new data and return only after the sync completed.
			// (This, of course, is slower)
			syncInBackground: true,		
		})
		.then(ret => {
			// found data go to then()
			//console.log(ret.userid);
			resolve(ret)
		})
		.catch(err => {
			reject(err)
		});
  
	});
};

export const checkStorage = async(key: string) => {
    try {
      const res = await getStorage(key)
      
      if (res && res === "1") {
        return true
      }
    } catch (error) {
      return false
    }
	return false
  }

export const removeStorage = (key: string) => {
	storage.remove({
		key
	});
}

