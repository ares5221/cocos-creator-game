using System;
using System.Collections.Generic;

/// <summary>
/// 收听器
/// </summary>
public interface INotifier
{
    void OnReceiveData(uint cmdId, object param1, object param2);
}