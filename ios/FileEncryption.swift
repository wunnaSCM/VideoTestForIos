//
//  FileEncryption.swift
//  VideoTest
//
//  Created by Wunna on 3/30/23.
//

import Foundation
import CryptoSwift
import BMHCrypto

 
 @objc(FileEncryption)
 class FileEncryption: NSObject {
  
   @objc func decryptFile(sourceFile: URL, desFile: URL, key: String, resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {

     do {
       print("source file :", sourceFile, "desFile :", desFile, "key: ", key)
       let data = try Data(contentsOf: sourceFile)
       let decrypted = try decryptChunk(encryptedData: data, key: key, iv: data.prefix(16).byteArray)
       try decrypted.write(to: desFile)
        resolve("File Decrypt Successful")
     } catch {
       reject("event_failure", "no event id returned", nil);
     }
    
   }
  
    @objc func decryptChunk(encryptedData: Data, key: String, iv: Array<UInt8>) throws -> Data {
       let newString = encryptedData.byteArray[16..<encryptedData.byteArray.count]
        let decryptedData = try! newString.byteArray.decrypt(cipher: AES(key: key.bytes, blockMode: CTR(iv: iv), padding: .noPadding))
       return Data(decryptedData)
   }

  
   @objc static func requiresMainQueueSetUp() -> Bool {
     return true;
   }
 }
