//
//  Counter.swift
//  VideoTest
//
//  Created by Wunna on 3/30/23.
//
import Foundation

@objc(Counter)
class Counter:NSObject {
    private var count = 0;

    // @objc func increment(resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
    //     count += 1;
    //     print("increase count", count)
    // }

    @objc func increment(_ email: String, password: String, resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
        resolve("You sent email '\(email)', password '\(password)'")
    }
  
    @objc
  static func requiresMainQueueSetUp() -> Bool {
    return true;
  }
    
}
