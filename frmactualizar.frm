VERSION 5.00
Begin VB.Form frmactualizar 
   BackColor       =   &H00C0FFC0&
   Caption         =   "Actualizar"
   ClientHeight    =   4740
   ClientLeft      =   60
   ClientTop       =   450
   ClientWidth     =   7995
   LinkTopic       =   "Form1"
   ScaleHeight     =   4740
   ScaleWidth      =   7995
   StartUpPosition =   3  'Windows Default
   Begin VB.OptionButton optmayor 
      BackColor       =   &H00C0FFC0&
      Caption         =   "Mayorista"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   12
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   375
      Left            =   4080
      TabIndex        =   12
      Top             =   720
      Width           =   1455
   End
   Begin VB.OptionButton optGremio 
      BackColor       =   &H00C0FFC0&
      Caption         =   "Gremio"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   12
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   375
      Left            =   2280
      TabIndex        =   11
      Top             =   720
      Width           =   1215
   End
   Begin VB.OptionButton optPublico 
      BackColor       =   &H00C0FFC0&
      Caption         =   "Publico"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   12
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   375
      Left            =   240
      TabIndex        =   10
      Top             =   720
      Width           =   1335
   End
   Begin VB.TextBox txtcarga 
      Alignment       =   2  'Center
      Height          =   495
      Left            =   2400
      TabIndex        =   2
      Top             =   3840
      Width           =   975
   End
   Begin VB.CommandButton cmdbuscar 
      BackColor       =   &H0080FF80&
      Caption         =   "Actualizar"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   14.25
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   -1  'True
         Strikethrough   =   0   'False
      EndProperty
      Height          =   1095
      Left            =   6240
      Picture         =   "frmactualizar.frx":0000
      Style           =   1  'Graphical
      TabIndex        =   3
      Top             =   2040
      Width           =   1575
   End
   Begin VB.ComboBox Combo2 
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   14.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   525
      Left            =   3120
      TabIndex        =   1
      Top             =   2040
      Width           =   2535
   End
   Begin VB.ComboBox Combo1 
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   14.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   525
      Left            =   0
      TabIndex        =   0
      Top             =   2040
      Width           =   2655
   End
   Begin VB.CommandButton cmdsalir 
      BackColor       =   &H000000FF&
      Caption         =   "Salir"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   14.25
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   -1  'True
         Strikethrough   =   0   'False
      EndProperty
      Height          =   1095
      Left            =   6240
      Picture         =   "frmactualizar.frx":1982
      Style           =   1  'Graphical
      TabIndex        =   4
      Top             =   3360
      Width           =   1575
   End
   Begin VB.Label Label5 
      AutoSize        =   -1  'True
      BackColor       =   &H00C0FFC0&
      Caption         =   "Porcentaje para Aumentar a Lista de Precios"
      Height          =   195
      Left            =   1560
      TabIndex        =   9
      Top             =   3360
      Width           =   3150
   End
   Begin VB.Label Label2 
      AutoSize        =   -1  'True
      BackColor       =   &H00C0FFC0&
      Caption         =   "%"
      Height          =   435
      Left            =   3600
      TabIndex        =   8
      Top             =   3840
      Width           =   255
   End
   Begin VB.Label Label4 
      AutoSize        =   -1  'True
      BackColor       =   &H00C00000&
      BackStyle       =   0  'Transparent
      Caption         =   "Hasta : "
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   18
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   -1  'True
         Strikethrough   =   0   'False
      EndProperty
      ForeColor       =   &H00000000&
      Height          =   495
      Left            =   3960
      TabIndex        =   7
      Top             =   1560
      Width           =   1275
   End
   Begin VB.Label Label3 
      AutoSize        =   -1  'True
      BackColor       =   &H00C00000&
      BackStyle       =   0  'Transparent
      Caption         =   "Desde :"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   18
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   -1  'True
         Strikethrough   =   0   'False
      EndProperty
      ForeColor       =   &H00000000&
      Height          =   495
      Left            =   720
      TabIndex        =   6
      Top             =   1560
      Width           =   1245
   End
   Begin VB.Label Label1 
      AutoSize        =   -1  'True
      BackColor       =   &H00C00000&
      BackStyle       =   0  'Transparent
      Caption         =   "Seleccionar Marca"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   20.25
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   -1  'True
         Strikethrough   =   0   'False
      EndProperty
      ForeColor       =   &H00000000&
      Height          =   570
      Left            =   1800
      TabIndex        =   5
      Top             =   0
      Width           =   3480
   End
End
Attribute VB_Name = "frmactualizar"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Private Sub cmdBuscar_Click()

    
If txtcarga.Text <> "" Then
    If Combo1.ListIndex <= Combo2.ListIndex Then
            If optPublico.Value = True Then
                miBase.Execute "update articulos set preciol1 = preciol1+preciol1 * " & txtcarga.Text & "/100 " & _
                       "where marca between '" & Combo1.Text & "' and '" & Combo2.Text & "'"
        
            
            ElseIf optGremio.Value = True Then
                miBase.Execute "update articulos set preciol2 = preciol2+preciol2 * " & txtcarga.Text & "/100 " & _
                       "where marca between '" & Combo1.Text & "' and '" & Combo2.Text & "'"
        

            ElseIf optmayor.Value = True Then
                miBase.Execute "update articulos set preciol3 = preciol3+preciol3 * " & txtcarga.Text & "/100 " & _
                        "where marca between '" & Combo1.Text & "' and '" & Combo2.Text & "'"
        
            End If
        End If
End If
    
MsgBox "Se actualizo la lista con exito", vbInformation
  

Unload Me

End Sub

Private Sub cmdsalir_Click()
Unload Me
End Sub

Private Sub Form_Activate()
optPublico.SetFocus
End Sub

Private Sub Form_Load()
Set miBase = OpenDatabase(App.Path & "\HY.mdb", False, False)
Set miRecor = miBase.OpenRecordset("select Marca from Articulos group by Marca", dbOpenDynaset)
If miRecor.RecordCount > 0 Then
    miRecor.MoveFirst
    Do While Not miRecor.EOF
        If Not IsNull(miRecor!marca) Then
            Combo1.AddItem miRecor!marca
            Combo2.AddItem miRecor!marca
        End If
        miRecor.MoveNext
    Loop
    If Combo1.ListCount > 0 Then
        Combo1.ListIndex = 0
        Combo2.ListIndex = Combo2.ListCount - 1
    End If
End If
miRecor.Close

End Sub



Private Sub txtcarga_Change()
If txtcarga.Text <> " " Then
    If Not IsNumeric(txtcarga.Text) Then
        MsgBox "dato no valido, debe ingresar solo numeros..", vbCritical, "mensaje"
        txtcarga.Text = 0
        SendKeys "+{tab}", True
    End If
End If
End Sub

Private Sub txtcarga_KeyDown(KeyCode As Integer, Shift As Integer)
If KeyCode = 13 Then SendKeys "{TAB}", True
End Sub
