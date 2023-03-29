package com.videotest;

import androidx.annotation.NonNull;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import javax.crypto.Cipher;
import javax.crypto.CipherOutputStream;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

public class FileEncryptionModule extends ReactContextBaseJavaModule {

    FileEncryptionModule(ReactApplicationContext context) {
        super(context);
    }

    @NonNull
    @Override
    public String getName() {
        return "FileEncryptionModule";
    }

    @ReactMethod
    public void decryptFile(String sourceFile,String desFile,String key,Promise promise){

        if(key.length() != 16){
            promise.reject("File Decryption","Invalid Key Length");
        }
        try {

            FileInputStream inputStream = new FileInputStream(sourceFile);
            FileOutputStream fileOutputStream = new FileOutputStream(desFile);

            byte[] enc_key = key.getBytes();
            SecretKeySpec mSecretKeySpec = new SecretKeySpec(enc_key, "AES");

            byte[] enc_iv = new byte[16];
            inputStream.read(enc_iv); // 16 byte read
            IvParameterSpec mIvParameterSpec = new IvParameterSpec(enc_iv);

            Cipher mCipher = Cipher.getInstance("AES/CTR/NoPadding");
            mCipher.init(Cipher.DECRYPT_MODE, mSecretKeySpec, mIvParameterSpec);
            CipherOutputStream cipherFileOutputStream = new CipherOutputStream(fileOutputStream, mCipher);

            byte[] buffer = new byte[4*1024];
            int bytesRead;
            while ((bytesRead = inputStream.read(buffer)) != -1) {
                cipherFileOutputStream.write(buffer, 0, bytesRead);
            }
            promise.resolve("File Encryption Success");

        }catch (Exception e){
            promise.reject("File Encryption Error", e);
        }
    }
}

