Attribute VB_Name = "Module1"
Public miBase As Database
Public flag As Byte
Public rClientes As Recordset
Public rArt As Recordset
Public rContador As Recordset
Public rCobranza As Recordset
Public rClientesaux As Recordset
Public rArtaux As Recordset
Public RremitoAux As Recordset
Public miRecor As Recordset
Public miRecor2 As Recordset
Public Campo As String
Public Campo2 As String
Public Criterio As String
Public criterio2 As String
Public rFacturas As Recordset
Public rFacturasDetalle As Recordset
Public rTemporalDetalledeFacturas As Recordset
Public rTemporalcobranzas As Recordset
Public rSumaTemporalCobranzas As Recordset
Public vcodcli As String * 5, vrazon As String, vlista As Integer
Public flagbuscarclientes As Byte
Public vSubtotal As Single
Public vIva21 As Single
Public vIva105 As Single
Public vtotal As Single
Public vBonif As Single
Public Function ElegirTipoIVA(valor As Variant) As String
    Select Case valor
           Case "RI": ElegirTipoIVA = "Responsable Insc."
           Case "RN": ElegirTipoIVA = "Responsable No Insc."
           Case "RM", "MT": ElegirTipoIVA = "Responsable Monotributo"
           Case "CF": ElegirTipoIVA = "Consumidor Final"
           Case "EX": ElegirTipoIVA = "Exento"
    End Select
End Function











Public Function LETRAS(numero As Single) As String
'*// Fuente que  convierte un numero en letras.
'*// El rango de <EXPN> es de  0  a  999.999.999.999.999,99
'*// Devuelve un valor de tipo caracter.
'*// ===============================================================
'*//
    Dim grupo As Integer, grupos(5) As String, _
        unilet As String, declet As String, _
        cenlet As String, conect As String, _
        Vdecimal As String, punto As Byte, _
        enletra As String, numstr As String, _
        unidad As String, decena As String, _
        centena As String, entero As String, _
        n As Integer
    '*//
    punto = 0
    grupo = 0
    entero = Trim(Str(numero))
    entero = String(18 - Len(entero), "0") + entero
    For n = 1 To 18
       If Mid(entero, n, 1) = "." Or Mid(entero, n, 1) = "," Then
        punto = n
       End If
    Next
    
    '// Conversion a caracter del numero justificando con ceros a la izq.
    '// Y sacar solo la parte entera del numero en el case de que halla
    '// decimales.
    
    If punto > 0 Then ' Si el Contenido de punto es mayor a 0
        'Se completa con los lugares decimales
        Vdecimal = Mid(entero, punto + 1, Len(entero) - punto)
        numstr = Mid(entero, 1, punto - 1)
        
        'si la cant. de digitos enteros es mayor a 15 hay que forzalo
        'a reducirse
        If Len(numstr) > 15 Then
            numstr = Right(numstr, 15)
        End If
        If Len(numstr) < 15 Then
            numstr = String(15 - Len(numstr), "0") + numstr
        End If
        
        'si hay un solo decimal completar el otro lugar con 0
        If Len(Vdecimal) = 1 Then
            Vdecimal = Vdecimal & "0"
        End If
        
    Else
        Vdecimal = "00"
        numstr = Mid(entero, 4, 15)
    End If
    
    '--- Separar la cifra en 5 grupos ------
    For grupo = 1 To 5
        grupos(5 - grupo + 1) = Mid(numstr, (grupo - 1) * 3 + 1, 3)
    Next
    
 
    '--- Proceso de union ----------------
    enletra = ""
    For grupo = 5 To 1 Step -1
        unidad = Right(grupos(grupo), 1)
        decena = Mid(grupos(grupo), 2, 1)
        centena = Left(grupos(grupo), 1)
        '------ Determino las unidades ---
        Select Case Val(unidad)
            Case 0: unilet = IIf(grupo = 1 And Val(entero) < 1, "CERO ", "")
            Case 1: unilet = IIf(decena = "1", "ONCE ", _
                         IIf(grupos(grupo) = "001" And (grupo = 2 Or grupo = 4), " ", _
                         IIf(grupo > 2, "UN ", "UNO ")))
            Case 2: unilet = IIf(decena = "1", "DOCE ", "DOS ")
            Case 3: unilet = IIf(decena = "1", "TRECE ", "TRES ")
            Case 4: unilet = IIf(decena = "1", "CATORCE ", "CUATRO ")
            Case 5: unilet = IIf(decena = "1", "QUINCE ", "CINCO ")
            Case 6: unilet = IIf(decena = "1", "DIECISEIS ", "SEIS ")
            Case 7: unilet = IIf(decena = "1", "DIECISIETE ", "SIETE ")
            Case 8: unilet = IIf(decena = "1", "DIECIOCHO ", "OCHO ")
            Case 9: unilet = IIf(decena = "1", "DIECINUEVE ", "NUEVE ")
        End Select
        '------ Determino las decenas ---
        Select Case Val(decena)
            Case 0: declet = ""
            Case 1: declet = IIf(unidad = "0", "DIEZ ", "")
            Case 2: declet = IIf(unidad = "0", "VEINTE ", "VEINTI")
            Case 3: declet = IIf(unidad = "0", "TREINTA ", "TREINTA Y ")
            Case 4: declet = IIf(unidad = "0", "CUARENTA ", "CUARENTA Y ")
            Case 5: declet = IIf(unidad = "0", "CINCUENTA ", "CINCUENTA Y ")
            Case 6: declet = IIf(unidad = "0", "SESENTA ", "SESENTA Y ")
            Case 7: declet = IIf(unidad = "0", "SETENTA ", "SETENTA Y ")
            Case 8: declet = IIf(unidad = "0", "OCHENTA ", "OCHENTA Y ")
            Case 9: declet = IIf(unidad = "0", "NOVENTA ", "NOVENTA Y ")
        End Select
        '------ Determino la centenas ---
        Select Case Val(centena)
            Case 0: cenlet = ""
            Case 1: cenlet = IIf(decena & unidad = "00", "CIEN ", "CIENTO ")
            Case 2: cenlet = "DOSCIENTOS "
            Case 3: cenlet = "TRESCIENTOS "
            Case 4: cenlet = "CUATROCIENTOS "
            Case 5: cenlet = "QUINIENTOS "
            Case 6: cenlet = "SEISCIENTOS "
            Case 7: cenlet = "SETECIENTOS "
            Case 8: cenlet = "OCHOCIENTOS "
            Case 9: cenlet = "NOVECIENTOS "
        End Select
        '------ Determino los conectores Ej: mil o Millones ---
        Select Case grupo
            Case 1: conect = ""
            Case 2: conect = IIf(grupos(2) > "000", "MIL ", "")
            Case 3: conect = IIf(grupos(3) > "000" Or grupos(4) > "000", _
                    IIf(grupos(3) = "001", "MILLON ", "MILLONES "), "")
            Case 4: conect = IIf(grupos(4) > "000", "MIL ", "")
            Case 5: conect = IIf(grupos(5) > "000", _
                    IIf(grupos(5) = "001", "BILLON ", "BILLONES "), "")
        End Select
        '------- Union de todos los grupo para forma la fraze -------
        enletra = enletra & cenlet & declet & unilet & conect
    Next
    LETRAS = enletra & " con " & Vdecimal & " centavos"
End Function

Public Function strzero(valor As String, ancho As Byte) As String
    strzero = Trim(valor)
    strzero = String(ancho - Len(strzero), "0") & strzero

End Function



